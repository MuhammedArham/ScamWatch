import assert from "node:assert/strict";
import test from "node:test";
import { MAX_REASON_CHARS, calculateRisk, highRiskFlags, mediumRiskFlags, sanitizeReason } from "../lib/risk.ts";

test("no flags is low risk", () => assert.equal(calculateRisk([]), "low"));

for (const flag of highRiskFlags) {
  test(`${flag} alone is high risk`, () => assert.equal(calculateRisk([flag]), "high"));
}

for (const flag of mediumRiskFlags) {
  test(`${flag} alone is medium risk`, () => assert.equal(calculateRisk([flag]), "medium"));
}

test("only medium flags stay medium", () => assert.equal(calculateRisk([...mediumRiskFlags]), "medium"));

test("mixed high and medium flags are high", () =>
  assert.equal(calculateRisk(["urgency_or_threats", "requests_remote_access", "secrecy_request"]), "high"));

test("every high flag together is high", () => assert.equal(calculateRisk([...highRiskFlags]), "high"));

test("all flags together are high", () =>
  assert.equal(calculateRisk([...highRiskFlags, ...mediumRiskFlags]), "high"));

test("flag lists do not overlap", () => {
  const overlap = highRiskFlags.filter((flag) => mediumRiskFlags.some((other) => other === flag));
  assert.deepEqual(overlap, []);
});

test("a 500 character reason is truncated to 200", () => {
  const reason = "a".repeat(500);
  assert.equal(sanitizeReason(reason).length, MAX_REASON_CHARS);
  assert.equal(MAX_REASON_CHARS, 200);
});

test("a short reason is left alone", () => {
  assert.equal(
    sanitizeReason("  The caller is asking for a code from your phone.  "),
    "The caller is asking for a code from your phone.",
  );
});

test("urls are stripped from the reason", () => {
  assert.equal(sanitizeReason("Go to https://harbour-bank.example/verify now"), "Go to now");
  assert.equal(sanitizeReason("Visit www.harbour-bank.example for help"), "Visit for help");
});

test("email addresses are stripped from the reason", () => {
  assert.equal(sanitizeReason("Email fraud@harbour.example to confirm"), "Email to confirm");
});

test("phone and account number runs are stripped from the reason", () => {
  assert.equal(sanitizeReason("Call 1800 555 123 right now"), "Call right now");
  assert.equal(sanitizeReason("Account 062 000 12345678 is at risk"), "Account is at risk");
});

test("ordinary small numbers survive", () => {
  assert.equal(sanitizeReason("The caller asked 3 times for your PIN"), "The caller asked 3 times for your PIN");
});

test("truncation happens before stripping so the cap always holds", () => {
  const reason = `${"b".repeat(190)} https://harbour-bank.example/a-very-long-path-that-would-overflow`;
  const result = sanitizeReason(reason);
  assert.ok(result.length <= MAX_REASON_CHARS);
  assert.ok(!result.includes("https://"));
});
