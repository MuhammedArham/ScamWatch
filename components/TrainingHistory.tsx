"use client";

import { useState } from "react";
import type { AttemptSummary } from "@/lib/types";

type Props = {
  attempts: AttemptSummary[];
  onBack: () => void;
  onClear: () => void;
};

function behaviourOutcomes(attempt: AttemptSummary) {
  return [
    [attempt.behaviours.shared_or_agreed_sensitive_info ? "Agreed to share sensitive information" : "Protected sensitive information", !attempt.behaviours.shared_or_agreed_sensitive_info],
    [attempt.behaviours.agreed_to_transfer ? "Agreed to move money" : "Avoided transferring money", !attempt.behaviours.agreed_to_transfer],
    [attempt.behaviours.agreed_to_remote_access ? "Agreed to remote device access" : "Avoided remote device access", !attempt.behaviours.agreed_to_remote_access],
    [attempt.behaviours.resisted_urgency ? "Resisted urgency" : "Was influenced by urgency", attempt.behaviours.resisted_urgency],
    [attempt.behaviours.independent_verification ? "Chose independent verification" : "Did not independently verify", attempt.behaviours.independent_verification],
    [attempt.behaviours.ended_suspicious_contact ? "Ended suspicious contact" : "Continued the suspicious interaction", attempt.behaviours.ended_suspicious_contact],
  ] as const;
}

export default function TrainingHistory({ attempts, onBack, onClear }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);
  const latest = attempts[0];
  const best = attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : null;

  return (
    <section aria-labelledby="history-heading" className="min-h-dvh w-full bg-[#faf8ef] px-5 py-8 text-[#272727] sm:px-10 sm:py-12 lg:px-16 xl:px-24">
      <h1 id="history-heading" className="text-4xl font-bold sm:text-5xl">Your training dashboard</h1>
      <p className="mt-4 text-lg text-slate-700">Only score summaries are saved here. Conversations are not saved.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <p className="rounded-2xl border border-[#e9e3d1] bg-white p-5 text-xl font-semibold shadow-sm">Training attempts: <strong className="block pt-2 text-3xl">{attempts.length}</strong></p>
        <p className="rounded-2xl bg-[#ffe08a] p-5 text-xl font-semibold shadow-sm">Best score: <strong className="block pt-2 text-3xl">{best === null ? "—" : best + "/100"}</strong></p>
        <p className="rounded-2xl bg-[#303030] p-5 text-xl font-semibold text-white shadow-sm">Latest score: <strong className="block pt-2 text-3xl">{latest ? latest.score + "/100" : "—"}</strong></p>
      </div>
      {latest && (
        <section aria-labelledby="latest-attempt-heading" className="mt-10 rounded-3xl border-2 border-[#ded9c9] bg-white p-5 sm:p-7">
          <h2 id="latest-attempt-heading" className="text-3xl font-bold">Your latest attempt</h2>
          <p className="mt-2 text-lg text-slate-700">
            {new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(latest.timestamp)} · {latest.score}/100
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {behaviourOutcomes(latest).map(([label, safe]) => (
              <li key={label} className="rounded-2xl border border-[#ded9c9] bg-[#faf8ef] p-4 text-lg font-semibold leading-snug">
                <span className="mr-2" aria-hidden="true">{safe ? "✓" : "!"}</span>
                <span className="text-base font-bold">{safe ? "Safe choice: " : "Needs practice: "}</span>
                {label}
              </li>
            ))}
          </ul>
        </section>
      )}
      <h2 className="mt-10 text-3xl font-bold">All attempts</h2>
      {attempts.length === 0 ? (
        <p className="mt-5 text-xl text-slate-700">No completed attempts yet.</p>
      ) : (
        <ol className="mt-5 grid gap-4 lg:grid-cols-2">
          {attempts.map((attempt, index) => {
            return (
              <li key={attempt.id}>
                <details className="rounded-2xl border-2 border-[#ded9c9] bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer text-xl font-bold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
                    Attempt {attempts.length - index} · {new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric" }).format(attempt.timestamp)} · {attempt.score}/100
                  </summary>
                  <ul className="mt-5 space-y-3 text-lg">
                    {behaviourOutcomes(attempt).map(([label, safe]) => (
                      <li key={label}>{safe ? "✓ Safe: " : "Needs practice: "}{label}</li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ol>
      )}
      {attempts.length > 0 && (
        <div className="mt-8">
          {!confirmClear ? (
            <button type="button" onClick={() => setConfirmClear(true)}
              className="min-h-14 rounded-xl border-2 border-rose-700 px-5 text-lg font-bold text-rose-800 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-rose-700">
              Clear training history
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-rose-700 p-5">
              <p className="text-xl font-semibold">Remove all saved score summaries from this device?</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <button type="button" onClick={() => { onClear(); setConfirmClear(false); }}
                  className="min-h-14 rounded-xl bg-rose-700 px-5 text-lg font-bold text-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-rose-700">
                  Yes, clear history
                </button>
                <button type="button" onClick={() => setConfirmClear(false)}
                  className="min-h-14 rounded-xl border-2 border-[#333333] px-5 text-lg font-bold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <button type="button" onClick={onBack}
        className="mt-10 min-h-16 w-full rounded-2xl bg-[#ffd866] px-6 text-xl font-bold text-[#272727] hover:bg-[#f3c94e] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727] sm:w-auto sm:min-w-64">
        Back to home
      </button>
    </section>
  );
}
