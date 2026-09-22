"use client";

import { useState } from "react";
import type { TranscriptEntry } from "@/lib/types";

type LiveCallProps = {
  onEnd: () => void;
  seconds: number;
  callStatus: "Connecting..." | "Jess is speaking" | "Listening to you" | "Call ended";
  microphoneStatus: "on" | "connecting";
  transcript: TranscriptEntry[];
  isEnding: boolean;
};

export default function LiveCall({
  onEnd,
  seconds,
  callStatus,
  microphoneStatus,
  transcript,
  isEnding,
}: LiveCallProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [view, setView] = useState<"phone" | "training">("phone");

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  const isListening = callStatus === "Listening to you";

  return (
    <section aria-labelledby="live-call-heading" className={`w-full max-w-3xl rounded-[2.5rem] border border-white/70 bg-[#faf8ef] shadow-2xl ${view === "phone" ? "p-3 sm:p-10 lg:p-12" : "p-6 sm:p-10 lg:p-12"}`}>
      <div className="mb-6 flex flex-wrap gap-3" role="group" aria-label="Call display">
        <button type="button" onClick={() => setView("phone")} aria-pressed={view === "phone"}
          className={`min-h-12 rounded-xl border-2 px-5 text-lg font-bold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727] ${view === "phone" ? "border-[#303030] bg-[#303030] text-white" : "border-[#78766c] bg-white text-[#272727]"}`}>
          Phone view
        </button>
        <button type="button" onClick={() => setView("training")} aria-pressed={view === "training"}
          className={`min-h-12 rounded-xl border-2 px-5 text-lg font-bold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727] ${view === "training" ? "border-[#303030] bg-[#303030] text-white" : "border-[#78766c] bg-white text-[#272727]"}`}>
          Training view
        </button>
      </div>
      {view === "phone" ? (
        <div className="mx-auto w-full max-w-[390px] rounded-[3.25rem] border-[10px] border-[#202024] bg-[#202024] p-1 shadow-xl">
          <div className="flex min-h-[750px] flex-col overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#446b87_0%,#285976_52%,#075681_100%)] px-6 pb-8 pt-5 text-center text-white sm:min-h-[790px] sm:px-8">
            <div className="mx-auto h-3 w-20 rounded-full bg-black/75" aria-hidden="true" />
            <p className="mx-auto mt-6 inline-flex rounded-full border border-white/60 bg-[#173b56]/60 px-4 py-2 text-base font-bold">Training simulation</p>
            <h1 id="live-call-heading" className="mt-9 text-5xl font-semibold tracking-tight">Jess</h1>
            <p className="mt-3 text-xl font-medium">Harbour Bank Fraud Team</p>
            <p className="mt-5 text-3xl font-bold tabular-nums" aria-label={`Call time ${minutes} minutes ${remainingSeconds} seconds`}>{minutes}:{remainingSeconds}</p>
            <div className="flex-1" />
            <p role="status" aria-live="polite" className="rounded-2xl border border-white/40 bg-white/10 px-4 py-4 text-2xl font-bold">{callStatus}</p>
            <p className="mt-5 inline-flex items-center justify-center gap-3 text-lg font-semibold">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-3.08A7 7 0 0 1 5 11a1 1 0 1 1 2 0 5 5 0 0 0 10 0Z" /></svg>
              </span>
              Microphone {microphoneStatus === "on" ? "ready" : "connecting"}
            </p>
            <button type="button" onClick={onEnd} disabled={isEnding}
              className="mx-auto mt-6 flex min-h-20 w-full items-center justify-center gap-4 rounded-3xl bg-[#d92534] px-6 text-2xl font-bold text-white shadow-lg transition hover:bg-[#bd1c2b] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60">
              <svg viewBox="0 0 24 24" className="h-9 w-9 fill-current" aria-hidden="true"><path d="M12 8c-3.7 0-7.1 1.2-9.6 3.4-.5.5-.6 1.2-.2 1.8l1.8 2.7c.4.6 1.1.8 1.7.5l2.5-1.1c.5-.2.8-.7.8-1.2v-1.1a12.9 12.9 0 0 1 6 0v1.1c0 .5.3 1 .8 1.2l2.5 1.1c.6.3 1.3.1 1.7-.5l1.8-2.7c.4-.6.3-1.3-.2-1.8C19.1 9.2 15.7 8 12 8Z" /></svg>
              End call
            </button>
          </div>
        </div>
      ) : (
      <>
      <div className="flex flex-col gap-6 border-b-2 border-[#ded9c9] pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#ffe49a] px-4 py-2 text-base font-bold text-slate-950">
            <span aria-hidden="true">⚠</span> Training simulation
          </p>
          <h1 id="live-call-heading" className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Jess — Harbour Bank Fraud Team
          </h1>
        </div>
        <p className="rounded-2xl bg-[#303030] px-5 py-3 text-3xl font-bold tabular-nums text-white" aria-label={`Call time ${minutes} minutes ${remainingSeconds} seconds`}>
          {minutes}:{remainingSeconds}
        </p>
      </div>

      <div className="py-10 text-center sm:py-14">
        <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full ${isListening ? "bg-emerald-200 text-emerald-950" : "bg-[#ffe49a] text-[#272727]"}`}>
          {isListening ? (
            <svg viewBox="0 0 24 24" className="h-14 w-14 fill-current" aria-hidden="true">
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-3.08A7 7 0 0 1 5 11a1 1 0 1 1 2 0 5 5 0 0 0 10 0Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-14 w-14 fill-current" aria-hidden="true">
              <path d="M4 9a2 2 0 0 1 2-2h2l3-3v16l-3-3H6a2 2 0 0 1-2-2V9Zm11.5-2.5a1 1 0 0 1 1.41 0A7 7 0 0 1 19 12a7 7 0 0 1-2.09 5.5 1 1 0 1 1-1.41-1.41A5 5 0 0 0 17 12a5 5 0 0 0-1.5-4.09 1 1 0 0 1 0-1.41Z" />
            </svg>
          )}
        </div>
        <p className="mt-7 text-lg font-bold uppercase tracking-[0.16em] text-slate-600">Call status</p>
        <p role="status" aria-live="polite" className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {callStatus}
        </p>
        <p className="mx-auto mt-5 max-w-xl text-xl leading-relaxed text-slate-700">
          Training only. Never share real banking details, passwords or verification codes. You can end the call at any time.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-[#ded9c9] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-3 text-lg font-bold text-slate-950">
            <span className={`h-4 w-4 rounded-full ${microphoneStatus === "on" ? "bg-emerald-500" : "bg-slate-400"}`} aria-hidden="true" />
            Microphone {microphoneStatus === "on" ? "ready" : "connecting"}
          </span>
          <span className="text-base font-semibold text-slate-600">Voice call</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-[#ded9c9] bg-white">
        <button
          type="button"
          onClick={() => setIsTranscriptOpen((open) => !open)}
          aria-expanded={isTranscriptOpen}
          className="flex min-h-16 w-full items-center justify-between px-5 text-left text-lg font-bold text-slate-950 transition hover:bg-[#fff4cb] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#272727]"
        >
          Practice transcript
          <span aria-hidden="true" className="text-2xl">{isTranscriptOpen ? "−" : "+"}</span>
        </button>
        {isTranscriptOpen && (
          <div className="border-t-2 border-slate-200 px-5 py-5 text-lg leading-relaxed text-slate-700">
            {transcript.length === 0 ? (
              <p>Conversation text will appear here as the call continues.</p>
            ) : (
              <ol className="max-h-64 space-y-3 overflow-y-auto">
                {transcript.map((entry) => (
                  <li key={entry.id}>
                    <strong className="text-slate-950">
                      {entry.role === "agent" ? "Jess" : "You"}:
                    </strong>{" "}
                    {entry.text}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
      </>
      )}

      {view === "training" && <button
        type="button"
        onClick={onEnd}
        disabled={isEnding}
        className="mt-8 flex min-h-20 w-full items-center justify-center gap-3 rounded-2xl bg-rose-700 px-7 text-2xl font-bold text-white shadow-lg transition hover:bg-rose-800 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true" className="text-3xl">×</span>
        End call
      </button>}
    </section>
  );
}
