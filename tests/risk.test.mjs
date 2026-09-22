import assert from "node:assert/strict";
import test from "node:test";
import { calculateRisk, highRiskFlags, mediumRiskFlags } from "../lib/risk.ts";

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
