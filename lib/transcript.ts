import type { TranscriptEntry, TranscriptRole } from "@/lib/types";

export type FinalTranscriptEvent = {
  eventId?: number;
  role: TranscriptRole;
  text: string;
  timestamp: number;
  replacesText?: string;
};

const FALLBACK_DUPLICATE_WINDOW_MS = 2_000;
const SHORT_ANSWER_LENGTH = 4;

export function normaliseTranscriptText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function addFinalTranscriptEvent(
  entries: TranscriptEntry[],
  event: FinalTranscriptEvent,
): TranscriptEntry[] {
  const text = normaliseTranscriptText(event.text);
  if (!text) return entries;

  const id =
    event.eventId === undefined
      ? `fallback:${event.role}:${event.timestamp}:${entries.length}`
      : `event:${event.role}:${event.eventId}`;
  const nextEntry: TranscriptEntry = {
    id,
    role: event.role,
    text,
    timestamp: event.timestamp,
  };
  const existingIndex = entries.findIndex((entry) => entry.id === id);

  if (existingIndex !== -1) {
    const existingEntry = entries[existingIndex];
    if (existingEntry.text === text) return entries;

    const updatedEntries = [...entries];
    updatedEntries[existingIndex] = {
      ...existingEntry,
      text,
      timestamp: event.timestamp,
    };
    return updatedEntries;
  }

  const replacesText = event.replacesText
    ? normaliseTranscriptText(event.replacesText)
    : "";
  const correctedEntryIndex =
    replacesText === ""
      ? -1
      : entries.findLastIndex(
          (entry) => entry.role === event.role && entry.text === replacesText,
        );

  if (correctedEntryIndex !== -1) {
    const updatedEntries = [...entries];
    updatedEntries[correctedEntryIndex] = {
      ...updatedEntries[correctedEntryIndex],
      text,
      timestamp: event.timestamp,
    };
    return updatedEntries;
  }

  const previous = entries.at(-1);
  const canUseTextFallback =
    event.eventId === undefined &&
    text.length > SHORT_ANSWER_LENGTH &&
    previous?.role === event.role &&
    previous.text === text &&
    event.timestamp - previous.timestamp < FALLBACK_DUPLICATE_WINDOW_MS;

  return canUseTextFallback ? entries : [...entries, nextEntry];
}
