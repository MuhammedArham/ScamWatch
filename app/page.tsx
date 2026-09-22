"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import HomeScreen from "@/components/HomeScreen";
import IncomingCall from "@/components/IncomingCall";
import LiveCall from "@/components/LiveCall";
import ResultsScreen from "@/components/ResultsScreen";
import TrainingHistory from "@/components/TrainingHistory";
import { addFinalTranscriptEvent } from "@/lib/transcript";
import { calculateScore } from "@/lib/score";
import { HISTORY_KEY, PROFILE_KEY, makeAttemptSummary, parseHistory } from "@/lib/trainingHistory";
import type { AppStage, AttemptSummary, CallEndReason, ScamAssessment, TrainingProfile, TranscriptEntry } from "@/lib/types";

const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim();

const assessmentSchema = z.strictObject({
  shared_or_agreed_sensitive_info: z.boolean(),
  agreed_to_transfer: z.boolean(),
  agreed_to_remote_access: z.boolean(),
  resisted_urgency: z.boolean(),
  independent_verification: z.boolean(),
  ended_suspicious_contact: z.boolean(),
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  feedback: z.string(),
});

export default function Home() {
  return (
    <ConversationProvider>
      <ScamSafeExperience />
    </ConversationProvider>
  );
}

function ScamSafeExperience() {
  const [stage, setStage] = useState<AppStage>("home");
  const [assessment, setAssessment] = useState<ScamAssessment | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [incomingError, setIncomingError] = useState<"microphone" | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  const [scoringFailed, setScoringFailed] = useState(false);
  const [profile, setProfile] = useState<TrainingProfile>({ preferredName: "", city: "" });
  const [rememberProfile, setRememberProfile] = useState(false);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [completedAt, setCompletedAt] = useState(0);

  const mountedRef = useRef(false);
  const acceptLockRef = useRef(false);
  const activeCallRef = useRef(false);
  const connectedRef = useRef(false);
  const endingRef = useRef(false);
  const completedRef = useRef(false);
  const endReasonRef = useRef<CallEndReason | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const completedTranscriptRef = useRef<TranscriptEntry[]>([]);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const endFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreControllerRef = useRef<AbortController | null>(null);
  const scoreStartedRef = useRef(false);
  const generationRef = useRef(0);
  const conversationIdRef = useRef<string | null>(null);
  const attemptsRef = useRef<AttemptSummary[]>([]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
          const parsed = z.strictObject({ preferredName: z.string().max(40), city: z.string().max(60) }).safeParse(JSON.parse(savedProfile));
          if (parsed.success) {
            setProfile(parsed.data);
            setRememberProfile(true);
            setHasSavedProfile(true);
          }
        }
        attemptsRef.current = parseHistory(localStorage.getItem(HISTORY_KEY));
        setAttempts(attemptsRef.current);
      } catch {
        // Storage can be unavailable in private browsing; the exercise still works.
      }
    });
    return () => { active = false; };
  }, []);

  const updateProfile = (next: TrainingProfile) => {
    const safe = {
      preferredName: next.preferredName.replace(/[^\p{L}\p{M}\s'-]/gu, "").slice(0, 40),
      city: next.city.replace(/[^\p{L}\p{M}\s'-]/gu, "").slice(0, 60),
    };
    setProfile(safe);
    if (rememberProfile) {
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(safe));
        setHasSavedProfile(true);
      } catch { /* Keep this profile in memory only. */ }
    }
  };

  const changeRememberProfile = (remember: boolean) => {
    setRememberProfile(remember);
    try {
      if (remember) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        setHasSavedProfile(true);
      } else {
        localStorage.removeItem(PROFILE_KEY);
        setHasSavedProfile(false);
      }
    } catch { /* Storage is optional. */ }
  };

  const clearSavedProfile = () => {
    try { localStorage.removeItem(PROFILE_KEY); } catch { /* Storage is optional. */ }
    setProfile({ preferredName: "", city: "" });
    setRememberProfile(false);
    setHasSavedProfile(false);
  };

  const clearHistory = () => {
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* Storage is optional. */ }
    attemptsRef.current = [];
    setAttempts([]);
  };

  const clearEndFallback = useCallback(() => {
    if (endFallbackRef.current !== null) clearTimeout(endFallbackRef.current);
    endFallbackRef.current = null;
  }, []);

  const recordEndReason = useCallback((reason: CallEndReason) => {
    endReasonRef.current = reason;
  }, []);

  const completeCall = useCallback((reason: CallEndReason) => {
    if (!mountedRef.current || completedRef.current) return;
    completedRef.current = true;
    activeCallRef.current = false;
    connectedRef.current = false;
    acceptLockRef.current = false;
    clearEndFallback();
    completedTranscriptRef.current = transcriptRef.current;
    setCompletedAt(Date.now());
    recordEndReason(reason);
    setIsStarting(false);
    setIsEnding(false);
    setStage("scoring");
  }, [clearEndFallback, recordEndReason]);

  const { startSession, endSession, status, isSpeaking, getId } = useConversation({
    onConnect: () => {
      if (!mountedRef.current || !activeCallRef.current || completedRef.current || endingRef.current) return;
      connectedRef.current = true;
      acceptLockRef.current = false;
      try {
        conversationIdRef.current = getId();
      } catch {
        conversationIdRef.current = null;
      }
      setIsStarting(false);
      // This SDK callback runs after connection, never during React render.
      // eslint-disable-next-line react-hooks/purity
      setConnectedAt(Date.now());
      setSeconds(0);
    },
    onDisconnect: () => {
      if (!mountedRef.current || !activeCallRef.current || completedRef.current) return;
      // The agent's End Call tool is an ordinary completed call, not a failure.
      completeCall(endReasonRef.current ?? (connectedRef.current ? "agent_ended" : "connection_error"));
    },
    onError: () => {
      if (!mountedRef.current || !activeCallRef.current || completedRef.current || endingRef.current) return;
      endingRef.current = true;
      recordEndReason("connection_error");
      endSession();
      completeCall("connection_error");
    },
    onMessage: ({ role, message, event_id }) => {
      if (!mountedRef.current || !activeCallRef.current || completedRef.current) return;
      transcriptRef.current = addFinalTranscriptEvent(transcriptRef.current, {
        eventId: event_id,
        role,
        text: message,
        timestamp: Date.now(),
      });
      setTranscript(transcriptRef.current);
    },
    onAgentResponseCorrection: ({ original_agent_response, corrected_agent_response, event_id }) => {
      if (!mountedRef.current || !activeCallRef.current || completedRef.current) return;
      transcriptRef.current = addFinalTranscriptEvent(transcriptRef.current, {
        eventId: event_id,
        role: "agent",
        text: corrected_agent_response,
        timestamp: Date.now(),
        replacesText: original_agent_response,
      });
      setTranscript(transcriptRef.current);
    },
  });

  const endCall = useCallback((reason: "user_ended" | "timeout") => {
    if (endingRef.current || completedRef.current) return;
    endingRef.current = true;
    recordEndReason(reason);
    setIsEnding(true);
    // A pending connection can fail without an onDisconnect callback.
    endFallbackRef.current = setTimeout(() => completeCall(reason), 5_000);
    endSession();
  }, [completeCall, endSession, recordEndReason]);

  const scoreCompletedCall = useCallback(async () => {
    const reason = endReasonRef.current;
    if (!reason || !completedRef.current || scoreStartedRef.current) return;
    scoreStartedRef.current = true;
    setScoringFailed(false);
    const generation = generationRef.current;
    const controller = new AbortController();
    scoreControllerRef.current = controller;
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: completedTranscriptRef.current, endReason: reason }),
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Scoring failed");
      const parsed = assessmentSchema.safeParse(await response.json());
      if (!parsed.success || parsed.data.score !== calculateScore(parsed.data)) {
        throw new Error("Invalid assessment");
      }
      if (!mountedRef.current || generation !== generationRef.current) return;
      const localId = crypto.randomUUID?.() ?? String(Date.now()) + "-" + Math.random().toString(36).slice(2);
      const summary = makeAttemptSummary(parsed.data, localId, Date.now());
      attemptsRef.current = [summary, ...attemptsRef.current].slice(0, 50);
      setAttempts(attemptsRef.current);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(attemptsRef.current)); } catch { /* Keep summaries in memory. */ }
      setAssessment(parsed.data);
      setStage("results");
    } catch {
      if (mountedRef.current && generation === generationRef.current) setScoringFailed(true);
    } finally {
      if (generation === generationRef.current) {
        scoreControllerRef.current = null;
        scoreStartedRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const onPageHide = () => {
      scoreControllerRef.current?.abort();
      microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
      if (activeCallRef.current || acceptLockRef.current) {
        activeCallRef.current = false;
        acceptLockRef.current = false;
        endingRef.current = true;
        endSession();
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("pagehide", onPageHide);
      clearEndFallback();
      scoreControllerRef.current?.abort();
      microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
      if (activeCallRef.current || acceptLockRef.current) {
        activeCallRef.current = false;
        acceptLockRef.current = false;
        endingRef.current = true;
        endSession();
      }
    };
  }, [clearEndFallback, endSession]);

  useEffect(() => {
    if (stage !== "call" || connectedAt === null) return;
    const updateTimer = () => {
      if (!mountedRef.current || endingRef.current) return;
      const elapsed = Math.floor((Date.now() - connectedAt) / 1000);
      setSeconds(Math.min(elapsed, 180));
      if (elapsed >= 180 && connectedRef.current) endCall("timeout");
    };
    updateTimer();
    const timer = window.setInterval(updateTimer, 1_000);
    return () => window.clearInterval(timer);
  }, [stage, connectedAt, endCall]);

  useEffect(() => {
    if (stage === "scoring") void scoreCompletedCall();
  }, [stage, scoreCompletedCall]);

  const acceptCall = async () => {
    if (stage !== "incoming" || acceptLockRef.current || connectedRef.current ||
        status === "connecting" || status === "connected" || !agentId) return;
    acceptLockRef.current = true;
    completedRef.current = false;
    endingRef.current = false;
    endReasonRef.current = null;
    conversationIdRef.current = null;
    transcriptRef.current = [];
    completedTranscriptRef.current = [];
    scoreStartedRef.current = false;
    setIncomingError(null);
    setIsStarting(true);
    setTranscript([]);
    setConnectedAt(null);
    setSeconds(0);

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone unavailable");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      stream.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
      if (!mountedRef.current || !acceptLockRef.current) return;
    } catch {
      if (mountedRef.current) {
        acceptLockRef.current = false;
        setIsStarting(false);
        setIncomingError("microphone");
      }
      return;
    }

    if (!mountedRef.current || !acceptLockRef.current) return;
    setStage("call");
    activeCallRef.current = true;
    try {
      const dynamicVariables: Record<string, string> = {};
      if (profile.preferredName.trim()) dynamicVariables.preferred_name = profile.preferredName.trim();
      if (profile.city.trim()) dynamicVariables.city = profile.city.trim();
      startSession({ agentId, ...(Object.keys(dynamicVariables).length ? { dynamicVariables } : {}) });
    } catch {
      completeCall("connection_error");
    }
  };

  const declineCall = () => {
    if (stage !== "incoming" || acceptLockRef.current || isStarting || completedRef.current) return;
    transcriptRef.current = [];
    completedTranscriptRef.current = [];
    setTranscript([]);
    completeCall("declined");
  };

  const startAgain = () => {
    generationRef.current += 1;
    scoreControllerRef.current?.abort();
    scoreControllerRef.current = null;
    clearEndFallback();
    microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
    microphoneStreamRef.current = null;
    transcriptRef.current = [];
    completedTranscriptRef.current = [];
    conversationIdRef.current = null;
    scoreStartedRef.current = false;
    acceptLockRef.current = false;
    activeCallRef.current = false;
    connectedRef.current = false;
    endingRef.current = false;
    completedRef.current = false;
    endReasonRef.current = null;
    setCompletedAt(0);
    setAssessment(null);
    setTranscript([]);
    setIncomingError(null);
    setIsStarting(false);
    setIsEnding(false);
    setConnectedAt(null);
    setSeconds(0);
    setScoringFailed(false);
    setStage("home");
  };

  const callStatus =
    isEnding || (status === "disconnected" && connectedAt !== null)
      ? "Call ended"
      : status === "connected"
        ? isSpeaking ? "Jess is speaking" : "Listening to you"
        : "Connecting...";

  return (
    <main className={stage === "history" ? "min-h-dvh bg-[#faf8ef] text-[#272727]" : "min-h-screen bg-[#aeb6c2] px-4 py-5 text-[#272727] sm:px-8 sm:py-8"}>
      <div className={stage === "history" ? "min-h-dvh w-full" : "mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]"}>
        {stage === "home" && (
          <HomeScreen onStart={() => setStage("incoming")} onHistory={() => setStage("history")}
            profile={profile} onProfileChange={updateProfile} rememberProfile={rememberProfile}
            onRememberChange={changeRememberProfile} onClearProfile={clearSavedProfile}
            hasSavedProfile={hasSavedProfile} />
        )}
        {stage === "history" && <TrainingHistory attempts={attempts} onBack={startAgain} onClear={clearHistory} />}
        {stage === "incoming" && (
          <IncomingCall
            onAccept={acceptCall}
            onDecline={declineCall}
            isStarting={isStarting}
            isConfigured={Boolean(agentId)}
            error={incomingError}
          />
        )}
        {stage === "call" && (
          <LiveCall
            onEnd={() => endCall("user_ended")}
            seconds={seconds}
            callStatus={callStatus}
            microphoneStatus={status === "connected" ? "on" : "connecting"}
            transcript={transcript}
            isEnding={isEnding}
          />
        )}
        {stage === "scoring" && (
          <ScoringScreen
            failed={scoringFailed}
            onRetry={() => void scoreCompletedCall()}
            onStartAgain={startAgain}
          />
        )}
        {stage === "results" && assessment && (
          <ResultsScreen results={assessment} onTryAgain={startAgain} onBackHome={startAgain}
            onDashboard={() => setStage("history")}
            transcript={transcript} completedAt={completedAt} />
        )}
      </div>
    </main>
  );
}

function ScoringScreen({
  failed,
  onRetry,
  onStartAgain,
}: {
  failed: boolean;
  onRetry: () => void;
  onStartAgain: () => void;
}) {
  return (
    <section aria-labelledby="scoring-heading" aria-live="polite"
      className="w-full max-w-xl rounded-[2.5rem] border border-white/70 bg-[#faf8ef] px-8 py-16 text-center shadow-2xl sm:px-14">
      {!failed && <div className="mx-auto mb-7 h-14 w-14 animate-spin rounded-full border-4 border-[#eee8d5] border-t-[#333333] motion-reduce:animate-none" aria-hidden="true" />}
      <p className="mb-3 text-lg font-bold uppercase tracking-[0.16em] text-[#514b38]">Training simulation</p>
      <h1 id="scoring-heading" className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        {failed ? "We couldn't generate your personalised feedback this time." : "Reviewing your response..."}
      </h1>
      {!failed && (
        <p className="mx-auto mt-5 max-w-md text-xl leading-relaxed text-slate-700">
          We&apos;re looking at how you handled pressure, verification, money requests and device-access requests.
        </p>
      )}
      {failed && (
        <div className="mt-10 space-y-4">
          <button type="button" onClick={onRetry}
            className="min-h-18 w-full rounded-2xl bg-[#ffd866] px-6 py-4 text-xl font-bold text-[#272727] hover:bg-[#f5c84a] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
            Try scoring again
          </button>
          <button type="button" onClick={onStartAgain}
            className="min-h-18 w-full rounded-2xl border-2 border-[#333333] px-6 py-4 text-xl font-bold text-[#272727] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
            Start another simulation
          </button>
        </div>
      )}
    </section>
  );
}
