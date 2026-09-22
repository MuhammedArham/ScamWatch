import type { TranscriptEntry } from "./types";

export function buildTranscriptText(transcript: TranscriptEntry[], completedAt: number): string {
  const date = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(completedAt);
  return [
    "ScamSafe Training Transcript",
    "This transcript is from an AI scam-awareness training simulation.",
    "Date: " + date,
    "Scenario: Harbour Bank Fraud Team",
    "",
    ...transcript.flatMap((entry) => [entry.role === "agent" ? "Jess:" : "You:", entry.text, ""]),
  ].join("\n");
}
