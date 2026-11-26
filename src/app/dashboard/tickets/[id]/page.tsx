import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { z } from "zod";
import {
  deleteTicket,
  rerunTriage,
  updateStatus,
} from "@/app/dashboard/tickets/manage";
import { ReplyEditor } from "@/components/reply-editor";
import { SubmitButton } from "@/components/submit-button";
import { TriageBadges } from "@/components/triage-badges";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL, type Ticket, type TicketStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Ticket" };

type TicketDetail = Ticket & { body: string };

const STATUSES: TicketStatus[] = ["open", "in_progress", "resolved"];
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export default async function TicketPage({
  params,
}: PageProps<"/dashboard/tickets/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id, customer_name, customer_email, subject, body, status, category, urgency, sentiment, summary, suggested_reply, ai_confidence, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Loading ticket failed:", error.message);
    return (
      <p
        role="alert"
        className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
      >
        We could not load this ticket. Please refresh the page.
      </p>
    );
  }
  if (!data) {
    notFound();
  }

  const ticket = data as TicketDetail;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to tickets
      </Link>

      <div className="rounded-card border bg-surface p-6 shadow-card">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          {ticket.subject}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {ticket.customer_name} · {ticket.customer_email} ·{" "}
          {dateFormat.format(new Date(ticket.created_at))}
        </p>

        <form
          action={updateStatus}
          className="mt-5 inline-flex flex-wrap gap-1 rounded-xl border bg-background p-1"
          aria-label="Ticket status"
        >
          <input type="hidden" name="id" value={ticket.id} />
          {STATUSES.map((status) => (
            <SubmitButton
              key={status}
              name="status"
              value={status}
              aria-pressed={ticket.status === status}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                ticket.status === status
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {STATUS_LABEL[status]}
            </SubmitButton>
          ))}
        </form>

        <div className="mt-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
            Customer message
          </h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
            {ticket.body}
          </p>
        </div>
      </div>

      <div className="rounded-card border bg-surface p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          AI triage
        </h2>

        {ticket.category ? (
          <div className="mt-4 space-y-5">
            <TriageBadges ticket={ticket} />
            {ticket.summary && (
              <p className="text-sm leading-relaxed">{ticket.summary}</p>
            )}
            {ticket.suggested_reply && (
              <ReplyEditor
                key={ticket.suggested_reply}
                ticketId={ticket.id}
                initialReply={ticket.suggested_reply}
              />
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted">
              This ticket has not been triaged yet.
            </p>
            <form action={rerunTriage}>
              <input type="hidden" name="id" value={ticket.id} />
              <SubmitButton
                pendingLabel="Triaging..."
                className="inline-flex h-9 items-center gap-2 rounded-lg border bg-surface px-3 text-sm font-medium transition hover:bg-surface-2"
              >
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                Run AI triage
              </SubmitButton>
            </form>
          </div>
        )}
      </div>

      <details className="rounded-card border border-danger/30 bg-surface p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-danger">
          <Trash2 className="size-4" aria-hidden="true" />
          Delete this ticket
        </summary>
        <p className="mt-3 text-sm text-muted">
          This permanently removes the ticket and its AI results. It cannot be
          undone.
        </p>
        <form action={deleteTicket} className="mt-3">
          <input type="hidden" name="id" value={ticket.id} />
          <SubmitButton
            pendingLabel="Deleting..."
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-danger px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            Yes, delete ticket
          </SubmitButton>
        </form>
      </details>
    </div>
  );
}
