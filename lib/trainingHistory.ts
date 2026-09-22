import { z } from "zod";
import type { AttemptSummary, ScamAssessment } from "./types";

export const HISTORY_KEY = "scamsafe-training-history";
export const PROFILE_KEY = "scamsafe-training-profile";

const summarySchema = z.strictObject({
  id: z.string(),
  timestamp: z.number().finite(),
  score: z.number().int().min(0).max(100),
  behaviours: z.strictObject({
    shared_or_agreed_sensitive_info: z.boolean(),
    agreed_to_transfer: z.boolean(),
    agreed_to_remote_access: z.boolean(),
    resisted_urgency: z.boolean(),
    independent_verification: z.boolean(),
    ended_suspicious_contact: z.boolean(),
  }),
});

export function parseHistory(value: string | null): AttemptSummary[] {
  if (!value) return [];
  try {
    const parsed = z.array(summarySchema).max(50).safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function makeAttemptSummary(
  assessment: ScamAssessment,
  id: string,
  timestamp: number,
): AttemptSummary {
  return {
    id,
    timestamp,
    score: assessment.score,
    behaviours: {
      shared_or_agreed_sensitive_info: assessment.shared_or_agreed_sensitive_info,
      agreed_to_transfer: assessment.agreed_to_transfer,
      agreed_to_remote_access: assessment.agreed_to_remote_access,
      resisted_urgency: assessment.resisted_urgency,
      independent_verification: assessment.independent_verification,
      ended_suspicious_contact: assessment.ended_suspicious_contact,
    },
  };
}
