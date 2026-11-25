export type AuthState = {
  error?: string;
  message?: string;
  email?: string;
};

export type TicketField =
  | "customer_name"
  | "customer_email"
  | "subject"
  | "body";

export type TicketFormState = {
  error?: string;
  fieldErrors?: Partial<Record<TicketField, string>>;
  values?: Partial<Record<TicketField, string>>;
};

export type TicketStatus = "open" | "in_progress" | "resolved";
export type TicketCategory =
  | "billing"
  | "bug"
  | "feature_request"
  | "account"
  | "how_to"
  | "other";
export type TicketUrgency = "low" | "medium" | "high" | "critical";
export type TicketSentiment = "positive" | "neutral" | "negative";

export type Ticket = {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  status: TicketStatus;
  category: TicketCategory | null;
  urgency: TicketUrgency | null;
  sentiment: TicketSentiment | null;
  summary: string | null;
  suggested_reply: string | null;
  ai_confidence: number | null;
  created_at: string;
};

export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
};

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  billing: "Billing",
  bug: "Bug",
  feature_request: "Feature request",
  account: "Account",
  how_to: "How-to",
  other: "Other",
};

export const URGENCY_LABEL: Record<TicketUrgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const SENTIMENT_LABEL: Record<TicketSentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};
