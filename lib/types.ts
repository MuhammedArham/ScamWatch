export type AppStage = "home" | "incoming" | "call" | "scoring" | "results";

export type Behaviour =
  | "shared_or_agreed_sensitive_info"
  | "agreed_to_transfer"
  | "agreed_to_remote_access"
  | "resisted_urgency"
  | "independent_verification"
  | "ended_suspicious_contact";

export type CallEndReason =
  | "user_ended"
  | "agent_ended"
  | "timeout"
  | "declined"
  | "connection_error";

export type TranscriptRole = "user" | "agent";

export interface TranscriptEntry {
  id: string;
  role: TranscriptRole;
  text: string;
  timestamp: number;
}

export interface ScamAssessment {
  shared_or_agreed_sensitive_info: boolean;
  agreed_to_transfer: boolean;
  agreed_to_remote_access: boolean;
  resisted_urgency: boolean;
  independent_verification: boolean;
  ended_suspicious_contact: boolean;
  score: number;
  strengths: string[];
  risks: string[];
  feedback: string;
}
