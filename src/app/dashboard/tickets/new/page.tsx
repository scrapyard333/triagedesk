import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
          Add a customer message. AI triage arrives in the next step.
        </p>
        <div className="mt-6">
          <TicketForm />
        </div>
      </div>
    </div>
  );
}
