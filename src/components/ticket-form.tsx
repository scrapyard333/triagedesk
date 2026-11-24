"use client";

import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { createTicket } from "@/app/dashboard/tickets/actions";
import type { TicketFormState } from "@/lib/types";
import { inputClass, primaryButtonClass } from "@/lib/ui";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TicketForm() {
  const [state, formAction, pending] = useActionState(
    createTicket,
    {} as TicketFormState,
  );
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="customer_name"
          label="Customer name"
          error={errors.customer_name}
        >
          <input
            id="customer_name"
            name="customer_name"
            defaultValue={values.customer_name}
            maxLength={120}
            required
            autoComplete="off"
            placeholder="Sara Ahmed"
            aria-invalid={Boolean(errors.customer_name)}
            aria-describedby={
              errors.customer_name ? "customer_name-error" : undefined
            }
            className={`${inputClass} h-11`}
          />
        </Field>

        <Field
          id="customer_email"
          label="Customer email"
          error={errors.customer_email}
        >
          <input
            id="customer_email"
            name="customer_email"
            type="email"
            defaultValue={values.customer_email}
            required
            autoComplete="off"
            placeholder="sara@example.com"
            aria-invalid={Boolean(errors.customer_email)}
            aria-describedby={
              errors.customer_email ? "customer_email-error" : undefined
            }
            className={`${inputClass} h-11`}
          />
        </Field>
      </div>

      <Field id="subject" label="Subject" error={errors.subject}>
        <input
          id="subject"
          name="subject"
          defaultValue={values.subject}
          maxLength={200}
          required
          autoComplete="off"
          placeholder="I was charged twice this month"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`${inputClass} h-11`}
        />
      </Field>

      <Field id="body" label="Message" error={errors.body}>
        <textarea
          id="body"
          name="body"
          defaultValue={values.body}
          maxLength={8000}
          required
          rows={7}
          placeholder="Paste the customer's message here."
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? "body-error" : undefined}
          className={`${inputClass} min-h-40 resize-y py-3 leading-relaxed`}
        />
      </Field>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending && (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          )}
          Save ticket
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center rounded-xl border bg-surface px-5 text-sm font-medium transition hover:bg-surface-2"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
