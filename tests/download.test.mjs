import assert from "node:assert/strict";
import test from "node:test";
import { buildTranscriptText } from "../lib/transcriptDownload.ts";

test("download contains only labelled final transcript entries and training context", () => {
  const text = buildTranscriptText([
    { id: "1", role: "agent", text: "Hello", timestamp: 1 },
    { id: "2", role: "user", text: "I will call back", timestamp: 2 },
  ], Date.UTC(2026, 8, 22));
  assert.match(text, /AI scam-awareness training simulation/);
  assert.match(text, /Scenario: Harbour Bank Fraud Team/);
  assert.match(text, /Jess:\nHello\n\nYou:\nI will call back/);
  assert.doesNotMatch(text, /Scammer|event_id|timestamp|system prompt/);
});
