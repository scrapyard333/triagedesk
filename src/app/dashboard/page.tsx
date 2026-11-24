import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Plus, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL, type Ticket } from "@/lib/types";

export const metadata: Metadata = { title: "Tickets" };

const statusTone = {
  open: "bg-primary/10 text-primary",
  in_progress: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
} as const;

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id, customer_name, customer_email, subject, status, category, urgency, sentiment, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const tickets = (data ?? []) as Ticket[];
  const stats = [
    { label: "Total", value: tickets.length },
    { label: "Open", value: tickets.filter((t) => t.status === "open").length },
    {
      label: "In progress",
      value: tickets.filter((t) => t.status === "in_progress").length,
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="mt-1 text-sm text-muted">
            Every customer message in one place.
          </p>
        </div>
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-card transition hover:bg-primary-hover"
        >
          <Plus className="size-4" aria-hidden="true" />
          New ticket
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border bg-surface p-4 shadow-card"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          We could not load your tickets. Please refresh the page.
        </p>
      ) : tickets.length === 0 ? (
        <div className="rounded-card border border-dashed bg-surface p-10 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Inbox className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-semibold">No tickets yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Add your first customer message and it will show up here.
          </p>
          <Link
            href="/dashboard/tickets/new"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            Create first ticket
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-card border bg-surface p-4 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-semibold">{ticket.subject}</h2>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[ticket.status]}`}
                >
                  {STATUS_LABEL[ticket.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {ticket.customer_name} · {ticket.customer_email} ·{" "}
                {dateFormat.format(new Date(ticket.created_at))}
              </p>
              {!ticket.category && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
                  <Sparkles
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />
                  Awaiting AI triage
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
