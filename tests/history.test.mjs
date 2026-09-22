import assert from "node:assert/strict";
import test from "node:test";
import { makeAttemptSummary, parseHistory } from "../lib/trainingHistory.ts";

const assessment = {
  shared_or_agreed_sensitive_info: false,
  agreed_to_transfer: false,
  agreed_to_remote_access: true,
  resisted_urgency: true,
  independent_verification: false,
  ended_suspicious_contact: true,
  score: 65,
  strengths: ["Example strength"],
  risks: ["Example risk"],
  feedback: "Example feedback",
  transcript: [{ role: "user", text: "Private conversation" }],
};

test("attempt summary contains only ID, timestamp, score, and six booleans", () => {
  const summary = makeAttemptSummary(assessment, "local-id", 12345);
  assert.deepEqual(Object.keys(summary), ["id", "timestamp", "score", "behaviours"]);
  assert.equal(Object.keys(summary.behaviours).length, 6);
  assert.equal(JSON.stringify(summary).includes("Private conversation"), false);
  assert.equal(JSON.stringify(summary).includes("Example feedback"), false);
});

test("saved summaries restore without transcripts", () => {
  const summary = makeAttemptSummary(assessment, "local-id", 12345);
  assert.deepEqual(parseHistory(JSON.stringify([summary])), [summary]);
  assert.deepEqual(parseHistory(JSON.stringify([{ ...summary, transcript: assessment.transcript }])), []);
});

test("invalid or missing history is ignored", () => {
  assert.deepEqual(parseHistory(null), []);
  assert.deepEqual(parseHistory("not json"), []);
});
