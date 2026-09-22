// Red flags the live guard watches for during a call. The model reports which
// flags are present; the risk level itself is always derived here, never by the
// model, for the same reason lib/score.ts owns the score.
export const highRiskFlags = [
  "asks_for_pin_or_otp",
  "asks_for_card_or_bank_details",
  "spoken_digits_detected",
  "requests_money_transfer",
  "requests_remote_access",
] as const;

export const mediumRiskFlags = [
  "urgency_or_threats",
  "impersonates_authority",
  "secrecy_request",
] as const;

export const redFlagNames = [...highRiskFlags, ...mediumRiskFlags] as const;

export type RedFlag = (typeof redFlagNames)[number];
export type RiskLevel = "low" | "medium" | "high";

export interface RiskAssessment {
  risk: RiskLevel;
  red_flags: RedFlag[];
  reason: string;
}

export const MAX_RISK_TRANSCRIPT_CHARS = 24_000;

const highRiskFlagSet = new Set<string>(highRiskFlags);

export function calculateRisk(flags: readonly RedFlag[]): RiskLevel {
  if (flags.some((flag) => highRiskFlagSet.has(flag))) return "high";
  return flags.length === 0 ? "low" : "medium";
}
