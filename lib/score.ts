import type { ScamAssessment } from "./types";

export type ScamClassification = Pick<ScamAssessment,
  "shared_or_agreed_sensitive_info" | "agreed_to_transfer" | "agreed_to_remote_access" |
  "resisted_urgency" | "independent_verification" | "ended_suspicious_contact"
>;

export const declinedClassification: ScamClassification = {
  shared_or_agreed_sensitive_info: false,
  agreed_to_transfer: false,
  agreed_to_remote_access: false,
  resisted_urgency: true,
  independent_verification: false,
  ended_suspicious_contact: true,
};

export function calculateScore(value: ScamClassification): number {
  return (value.shared_or_agreed_sensitive_info ? 0 : 20) +
    (value.agreed_to_transfer ? 0 : 20) +
    (value.agreed_to_remote_access ? 0 : 20) +
    (value.resisted_urgency ? 15 : 0) +
    (value.independent_verification ? 15 : 0) +
    (value.ended_suspicious_contact ? 10 : 0);
}
