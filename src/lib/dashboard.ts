import {
  CATEGORY_LABEL,
  URGENCY_LABEL,
  type TicketCategory,
  type TicketStatus,
  type TicketUrgency,
} from "@/lib/types";

export type Slice = { key: string; name: string; value: number };

export type Filters = {
  q: string;
  status: TicketStatus | "";
  category: TicketCategory | "";
  urgency: TicketUrgency | "";
};

export type TicketLite = {
  status: TicketStatus;
  category: TicketCategory | null;
  urgency: TicketUrgency | null;
  created_at: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

export const STATUS_VALUES = ["open", "in_progress", "resolved"] as const;
export const CATEGORY_VALUES = Object.keys(CATEGORY_LABEL) as TicketCategory[];
export const URGENCY_VALUES = ["critical", "high", "medium", "low"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function pick<T extends string>(value: string, allowed: readonly T[]): T | "" {
  return (allowed as readonly string[]).includes(value) ? (value as T) : "";
}

export function parseFilters(params: SearchParams): Filters {
  return {
    q: first(params.q).trim().slice(0, 100),
    status: pick(first(params.status), STATUS_VALUES),
    category: pick(first(params.category), CATEGORY_VALUES),
    urgency: pick(first(params.urgency), URGENCY_VALUES),
  };
}

// Keeps only letters, numbers, spaces and a few safe symbols, so a search
// can never change the structure of the database filter.
const UNSAFE = new RegExp("[^\\p{L}\\p{N}\\s@._-]", "gu");

export function searchTerm(q: string) {
  return q.replace(UNSAFE, "").trim().slice(0, 80);
}

export function buildStats(tickets: TicketLite[]) {
  return [
    { label: "Total", value: tickets.length },
    { label: "Open", value: tickets.filter((t) => t.status === "open").length },
    {
      label: "Urgent",
      value: tickets.filter(
        (t) => t.urgency === "high" || t.urgency === "critical",
      ).length,
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
    },
  ];
}

export function categoryData(tickets: TicketLite[]): Slice[] {
  const counts = new Map<string, number>();
  for (const ticket of tickets) {
    if (ticket.category) {
      counts.set(ticket.category, (counts.get(ticket.category) ?? 0) + 1);
    }
  }
  return CATEGORY_VALUES.map((key) => ({
    key,
    name: CATEGORY_LABEL[key],
    value: counts.get(key) ?? 0,
  }))
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function urgencyData(tickets: TicketLite[]): Slice[] {
  const counts = new Map<string, number>();
  for (const ticket of tickets) {
    if (ticket.urgency) {
      counts.set(ticket.urgency, (counts.get(ticket.urgency) ?? 0) + 1);
    }
  }
  return URGENCY_VALUES.map((key) => ({
    key,
    name: URGENCY_LABEL[key],
    value: counts.get(key) ?? 0,
  })).filter((slice) => slice.value > 0);
}

// Tickets created per day for the last 7 days (days are counted in UTC).
export function volumeData(tickets: TicketLite[], now: Date): Slice[] {
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });

  const days: Slice[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
    days.push({
      key: day.toISOString().slice(0, 10),
      name: weekday.format(day),
      value: 0,
    });
  }

  const index = new Map(days.map((day, position) => [day.key, position]));
  for (const ticket of tickets) {
    const position = index.get(ticket.created_at.slice(0, 10));
    if (position !== undefined) {
      days[position].value += 1;
    }
  }
  return days;
}
