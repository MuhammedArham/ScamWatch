"use client";

import type { ScamAssessment, TranscriptEntry } from "@/lib/types";
import { buildTranscriptText } from "@/lib/transcriptDownload";

type ResultsScreenProps = {
  results: ScamAssessment;
  onTryAgain: () => void;
  onBackHome: () => void;
  onDashboard: () => void;
  transcript: TranscriptEntry[];
  completedAt: number;
};

function scoreMessage(score: number) {
  if (score >= 90) return "Excellent scam resistance";
  if (score >= 75) return "Strong response";
  if (score >= 50) return "Some risky moments";
  return "More practice recommended";
}

export default function ResultsScreen({ results, onTryAgain, onBackHome, onDashboard, transcript, completedAt }: ResultsScreenProps) {
  const downloadTranscript = () => {
    const url = URL.createObjectURL(new Blob([buildTranscriptText(transcript, completedAt)], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "scamsafe-training-transcript.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  };
  const behaviours = [
    {
      label: results.shared_or_agreed_sensitive_info
        ? "Agreed to share sensitive information" : "Protected sensitive information",
      safe: !results.shared_or_agreed_sensitive_info,
    },
    {
      label: results.agreed_to_transfer ? "Agreed to move money" : "Avoided transferring money",
      safe: !results.agreed_to_transfer,
    },
    {
      label: results.agreed_to_remote_access ? "Agreed to remote device access" : "Avoided remote device access",
      safe: !results.agreed_to_remote_access,
    },
    {
      label: results.resisted_urgency ? "Resisted urgency" : "Was influenced by urgency",
      safe: results.resisted_urgency,
    },
    {
      label: results.independent_verification ? "Chose independent verification" : "Did not independently verify",
      safe: results.independent_verification,
    },
    {
      label: results.ended_suspicious_contact ? "Ended suspicious contact" : "Continued the suspicious interaction",
      safe: results.ended_suspicious_contact,
    },
  ];

  return (
    <section aria-labelledby="results-heading" className="w-full max-w-5xl rounded-[2.5rem] border border-white/70 bg-[#faf8ef] p-6 shadow-2xl sm:p-10 lg:p-14">
      <header className="border-b-2 border-[#ded9c9] pb-9 text-center">
        <p className="text-lg font-bold uppercase tracking-[0.16em] text-[#514b38]">Training simulation complete</p>
        <h1 id="results-heading" className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Scam Resistance
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-2xl font-semibold leading-relaxed text-slate-800">
          {scoreMessage(results.score)}
        </p>
        <div className="mx-auto mt-9 flex h-48 w-48 flex-col items-center justify-center rounded-full border-[12px] border-[#ffd866] bg-white text-slate-950 shadow-sm" aria-label={"Scam Resistance score " + results.score + " out of 100"}>
          <span className="text-lg font-bold uppercase tracking-wide text-[#3d3a32]">Scam Resistance</span>
          <span className="mt-1 text-5xl font-bold tabular-nums">{results.score}<span className="text-3xl">/100</span></span>
        </div>
      </header>

      <section aria-labelledby="behaviours-heading" className="mt-10">
        <h2 id="behaviours-heading" className="text-3xl font-bold text-slate-950">Your six key behaviours</h2>
        <ul className="mt-5 space-y-3">
          {behaviours.map((item) => (
            <li key={item.label} className="flex flex-col gap-4 rounded-2xl border-2 border-[#e5dfcd] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xl font-bold text-slate-950">{item.label}</p>
              <span className={"inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full px-4 text-base font-bold sm:self-auto " +
                (item.safe ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950")}>
                <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70">
                  {item.safe ? "✓" : "!"}
                </span>
                {item.safe ? "Safe choice" : "Needs practice"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="strengths-heading" className="rounded-2xl border border-[#d8e8d9] bg-[#f0f7ef] p-6">
          <h2 id="strengths-heading" className="text-2xl font-bold text-slate-950">What you did well</h2>
          {results.strengths.length === 0 ? (
            <p className="mt-4 text-lg leading-relaxed text-slate-800">Every practice call is a chance to learn.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-lg leading-relaxed text-slate-800">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex gap-3"><span aria-hidden="true" className="font-bold text-emerald-800">✓</span>{strength}</li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="practice-heading" className="rounded-2xl border border-[#ead69b] bg-[#fff2ca] p-6">
          <h2 id="practice-heading" className="text-2xl font-bold text-slate-950">What to practise</h2>
          {results.risks.length === 0 ? (
            <p className="mt-4 text-lg leading-relaxed text-slate-800">No specific risks were noted in this exercise.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-lg leading-relaxed text-slate-800">
              {results.risks.map((risk, index) => (
                <li key={index} className="flex gap-3"><span aria-hidden="true" className="font-bold text-amber-800">→</span>{risk}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="feedback-heading" className="mt-6 rounded-2xl bg-[#303030] p-6 text-white sm:p-8">
        <h2 id="feedback-heading" className="text-2xl font-bold">Your feedback</h2>
        <p className="mt-4 text-xl leading-relaxed text-slate-100">{results.feedback}</p>
      </section>

      <details className="mt-6 rounded-2xl border-2 border-[#ded9c9] bg-white p-6">
        <summary className="cursor-pointer text-xl font-bold text-slate-950 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
          View conversation transcript
        </summary>
        {transcript.length === 0 ? (
          <p className="mt-5 text-lg text-slate-700">No conversation text was captured for this attempt.</p>
        ) : (
          <>
            <ol className="mt-5 max-h-96 space-y-4 overflow-y-auto text-lg leading-relaxed text-slate-800">
              {transcript.map((entry) => (
                <li key={entry.id}><strong className="text-slate-950">{entry.role === "agent" ? "Jess" : "You"}:</strong> {entry.text}</li>
              ))}
            </ol>
            <button type="button" onClick={downloadTranscript}
              className="mt-6 min-h-14 rounded-xl border-2 border-[#333333] px-5 text-lg font-bold text-[#272727] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
              Download transcript
            </button>
          </>
        )}
      </details>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={onDashboard}
          className="flex min-h-18 w-full items-center justify-center rounded-2xl bg-[#303030] px-7 text-2xl font-bold text-white shadow-lg transition hover:bg-[#484848] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727] sm:col-span-2">
          View dashboard
        </button>
        <button type="button" onClick={onTryAgain}
          className="flex min-h-18 w-full items-center justify-center rounded-2xl bg-[#ffd866] px-7 text-2xl font-bold text-[#272727] shadow-lg transition hover:bg-[#f3c94e] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
          Try again
        </button>
        <button type="button" onClick={onBackHome}
          className="flex min-h-18 w-full items-center justify-center rounded-2xl border-2 border-[#333333] px-7 text-2xl font-bold text-slate-950 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#272727]">
          Back to home
        </button>
      </div>
    </section>
  );
}
