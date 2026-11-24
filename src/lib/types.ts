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

export type Ticket = {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  status: TicketStatus;
  category: string | null;
  urgency: string | null;
  sentiment: string | null;
  created_at: string;
};

export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
};
