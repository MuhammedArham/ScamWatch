"use client";

import { useState } from "react";
import type { TranscriptEntry } from "@/lib/types";

type LiveCallProps = {
  onEnd: () => void;
  seconds: number;
  callStatus: "Connecting..." | "Scammer speaking" | "Listening to you" | "Call ended";
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

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  const isListening = callStatus === "Listening to you";

  return (
    <section aria-labelledby="live-call-heading" className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-10 lg:p-12">
      <div className="flex flex-col gap-6 border-b-2 border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-base font-bold text-slate-950">
            <span aria-hidden="true">⚠</span> Training simulation
          </p>
          <h1 id="live-call-heading" className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Harbour Bank Fraud Team
          </h1>
        </div>
        <p className="rounded-2xl bg-slate-950 px-5 py-3 text-3xl font-bold tabular-nums text-white" aria-label={`Call time ${minutes} minutes ${remainingSeconds} seconds`}>
          {minutes}:{remainingSeconds}
        </p>
      </div>

      <div className="py-10 text-center sm:py-14">
        <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full ${isListening ? "bg-emerald-200 text-emerald-950" : "bg-sky-100 text-sky-950"}`}>
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

      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-3 text-lg font-bold text-slate-950">
            <span className={`h-4 w-4 rounded-full ${microphoneStatus === "on" ? "bg-emerald-500" : "bg-slate-400"}`} aria-hidden="true" />
            Microphone {microphoneStatus === "on" ? "ready" : "connecting"}
          </span>
          <span className="text-base font-semibold text-slate-600">Voice call</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-slate-200">
        <button
          type="button"
          onClick={() => setIsTranscriptOpen((open) => !open)}
          aria-expanded={isTranscriptOpen}
          className="flex min-h-16 w-full items-center justify-between px-5 text-left text-lg font-bold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-700"
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
                      {entry.role === "agent" ? "Scammer" : "You"}:
                    </strong>{" "}
                    {entry.text}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onEnd}
        disabled={isEnding}
        className="mt-8 flex min-h-20 w-full items-center justify-center gap-3 rounded-2xl bg-rose-700 px-7 text-2xl font-bold text-white shadow-lg transition hover:bg-rose-800 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true" className="text-3xl">×</span>
        End call
      </button>
    </section>
  );
}
