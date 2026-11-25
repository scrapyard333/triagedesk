import {
  CATEGORY_LABEL,
  SENTIMENT_LABEL,
  URGENCY_LABEL,
  type Ticket,
  type TicketSentiment,
  type TicketUrgency,
} from "@/lib/types";

const urgencyTone: Record<TicketUrgency, string> = {
  low: "bg-surface-2 text-muted",
  medium: "bg-accent/10 text-accent",
  high: "bg-warning/10 text-warning",
  critical: "bg-danger/10 text-danger",
};

const sentimentTone: Record<TicketSentiment, string> = {
  positive: "bg-success/10 text-success",
  neutral: "bg-surface-2 text-muted",
  negative: "bg-warning/10 text-warning",
};

function Chip({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
}

export function TriageBadges({
  ticket,
}: {
  ticket: Pick<Ticket, "category" | "urgency" | "sentiment" | "ai_confidence">;
}) {
  if (!ticket.category || !ticket.urgency || !ticket.sentiment) {
    return null;
  }

  const confidence =
    ticket.ai_confidence === null
      ? null
      : Math.round(Number(ticket.ai_confidence) * 100);

  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        label={CATEGORY_LABEL[ticket.category]}
        tone="bg-primary/10 text-primary"
      />
      <Chip
        label={`Urgency: ${URGENCY_LABEL[ticket.urgency]}`}
        tone={urgencyTone[ticket.urgency]}
      />
      <Chip
        label={`Sentiment: ${SENTIMENT_LABEL[ticket.sentiment]}`}
        tone={sentimentTone[ticket.sentiment]}
      />
      {confidence !== null && (
        <Chip label={`Confidence ${confidence}%`} tone="bg-accent/10 text-accent" />
      )}
    </div>
  );
}
