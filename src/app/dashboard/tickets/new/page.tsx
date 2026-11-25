import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { TicketForm } from "@/components/ticket-form";

export const metadata: Metadata = { title: "New ticket" };

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to tickets
      </Link>
      <div className="rounded-card border bg-surface p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">New ticket</h1>
        <p className="mt-2 text-sm text-muted">
          Add a customer message. AI triage runs when you save and takes a few
          seconds.
        </p>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          This is a demo. Please use fake customer details only, because the
          free AI tier may use prompts to improve its products.
        </p>
        <div className="mt-6">
          <TicketForm />
        </div>
      </div>
    </div>
  );
}
