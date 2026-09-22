import assert from "node:assert/strict";
import test from "node:test";
import { calculateScore, declinedClassification } from "../lib/score.ts";

const safe = {
  shared_or_agreed_sensitive_info: false,
  agreed_to_transfer: false,
  agreed_to_remote_access: false,
  resisted_urgency: true,
  independent_verification: true,
  ended_suspicious_contact: true,
};

test("completely safe classification", () => assert.equal(calculateScore(safe), 100));
test("agrees to remote access", () => assert.equal(calculateScore({ ...safe, agreed_to_remote_access: true }), 80));
test("agrees to transfer", () => assert.equal(calculateScore({ ...safe, agreed_to_transfer: true }), 80));
test("agrees to both", () => assert.equal(calculateScore({ ...safe, agreed_to_transfer: true, agreed_to_remote_access: true }), 60));
test("shares sensitive information", () => assert.equal(calculateScore({ ...safe, shared_or_agreed_sensitive_info: true }), 80));
test("no positive safe behaviours", () => assert.equal(calculateScore({
  shared_or_agreed_sensitive_info: true, agreed_to_transfer: true, agreed_to_remote_access: true,
  resisted_urgency: false, independent_verification: false, ended_suspicious_contact: false,
}), 0));
test("declined call special case", () => {
  assert.deepEqual(declinedClassification, { ...safe, independent_verification: false });
  assert.equal(calculateScore(declinedClassification), 85);
});
