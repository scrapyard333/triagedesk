import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Plus, SearchX, Sparkles } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";
import { RetryTriageForm } from "@/components/retry-triage-form";
import { TicketFilters } from "@/components/ticket-filters";
import { TriageBadges } from "@/components/triage-badges";
import {
  buildStats,
  categoryData,
  parseFilters,
  searchTerm,
  urgencyData,
  volumeData,
  type TicketLite,
} from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL, type Ticket } from "@/lib/types";

export const metadata: Metadata = { title: "Tickets" };

const LIST_COLUMNS =
  "id, customer_name, customer_email, subject, status, category, urgency, sentiment, summary, suggested_reply, ai_confidence, created_at";

const statusTone = {
  open: "bg-primary/10 text-primary",
  in_progress: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
} as const;

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const filters = parseFilters(await searchParams);
  const supabase = await createClient();

  let listQuery = supabase
    .from("tickets")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(50);

  if (filters.status) {
    listQuery = listQuery.eq("status", filters.status);
  }
  if (filters.category) {
    listQuery = listQuery.eq("category", filters.category);
  }
  if (filters.urgency) {
    listQuery = listQuery.eq("urgency", filters.urgency);
  }
  const term = searchTerm(filters.q);
  if (term) {
    listQuery = listQuery.or(
      `subject.ilike.%${term}%,customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`,
    );
  }

  const [listResult, allResult] = await Promise.all([
    listQuery,
    supabase
      .from("tickets")
      .select("status, category, urgency, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
  ]);

  const error = listResult.error ?? allResult.error;
  const tickets = (listResult.data ?? []) as Ticket[];
  const all = (allResult.data ?? []) as TicketLite[];
  const hasFilters = Boolean(
    filters.q || filters.status || filters.category || filters.urgency,
  );

  const stats = buildStats(all);
  const categories = categoryData(all);
  const urgencies = urgencyData(all);
  const volume = volumeData(all, new Date());

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="mt-1 text-sm text-muted">
            Every customer message, triaged by AI.
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
      ) : all.length === 0 ? (
        <div className="rounded-card border border-dashed bg-surface p-10 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Inbox className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-semibold">No tickets yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Add your first customer message and AI will label it in seconds.
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
        <>
          <DashboardCharts
            categories={categories}
            urgencies={urgencies}
            volume={volume}
          />

          <div className="space-y-4">
            <TicketFilters
              initial={{
                q: filters.q,
                status: filters.status,
                category: filters.category,
                urgency: filters.urgency,
              }}
            />
            <p className="text-sm text-muted" aria-live="polite">
              Showing {tickets.length} of {all.length} tickets
            </p>

            {tickets.length === 0 ? (
              <div className="rounded-card border border-dashed bg-surface p-10 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <SearchX className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-semibold">No tickets match</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Try a different search or clear the filters.
                </p>
                {hasFilters && (
                  <Link
                    href="/dashboard"
                    className="mt-5 inline-flex h-10 items-center rounded-xl border bg-surface px-4 text-sm font-medium transition hover:bg-surface-2"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            ) : (
              <ul className="space-y-3">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="rounded-card border bg-surface p-4 shadow-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="font-semibold">
                        <Link
                          href={`/dashboard/tickets/${ticket.id}`}
                          className="transition hover:text-primary"
                        >
                          {ticket.subject}
                        </Link>
                      </h2>
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

                    {ticket.category ? (
                      <div className="mt-3 space-y-3">
                        <TriageBadges ticket={ticket} />
                        {ticket.summary && (
                          <p className="text-sm leading-relaxed">
                            {ticket.summary}
                          </p>
                        )}
                        {ticket.suggested_reply && (
                          <details className="rounded-xl bg-surface-2 p-3 text-sm">
                            <summary className="cursor-pointer font-medium">
                              Draft reply
                            </summary>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted">
                              {ticket.suggested_reply}
                            </p>
                          </details>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
                          <Sparkles
                            className="size-3.5 text-primary"
                            aria-hidden="true"
                          />
                          Awaiting AI triage
                        </p>
                        <RetryTriageForm ticketId={ticket.id} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
