"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Sparkles } from "lucide-react";
import { retryTriage } from "@/app/dashboard/tickets/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-surface px-3 text-xs font-medium transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
      )}
      {pending ? "Triaging..." : "Run AI triage"}
    </button>
  );
}

export function RetryTriageForm({ ticketId }: { ticketId: string }) {
  return (
    <form action={retryTriage}>
      <input type="hidden" name="id" value={ticketId} />
      <SubmitButton />
    </form>
  );
}
