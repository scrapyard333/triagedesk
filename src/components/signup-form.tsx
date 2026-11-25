"use client";

import { useActionState, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { signup } from "@/app/auth/actions";
import { PasswordInput } from "@/components/password-input";
import { PasswordStrength } from "@/components/password-strength";
import type { SignupState } from "@/lib/auth-types";
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

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signup,
    {} as SignupState,
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <Field id="full_name" label="Full name" error={errors.full_name}>
        <input
          id="full_name"
          name="full_name"
          autoComplete="name"
          required
          maxLength={80}
          defaultValue={values.full_name}
          placeholder="Your full name"
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className={`${inputClass} h-11`}
        />
      </Field>

      <Field id="email" label="Work email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values.email}
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${inputClass} h-11`}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a strong password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        <PasswordStrength password={password} />
      </Field>

      <Field
        id="confirm_password"
        label="Confirm password"
        error={
          errors.confirm_password ??
          (mismatch ? "Passwords do not match yet." : undefined)
        }
      >
        <PasswordInput
          id="confirm_password"
          name="confirm_password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Type it again"
          aria-invalid={Boolean(errors.confirm_password) || mismatch}
          aria-describedby={
            errors.confirm_password || mismatch
              ? "confirm_password-error"
              : undefined
          }
        />
      </Field>

      <div className="space-y-1.5">
        <label className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
          <input
            type="checkbox"
            name="ack"
            className="mt-1 size-4 shrink-0 accent-primary"
            aria-invalid={Boolean(errors.ack)}
            aria-describedby={errors.ack ? "ack-error" : undefined}
          />
          <span>
            I understand this is a demo and I will use fake customer data only.
          </span>
        </label>
        {errors.ack && (
          <p id="ack-error" className="text-xs text-danger">
            {errors.ack}
          </p>
        )}
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      {state.message && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl bg-success/10 px-3 py-2.5 text-sm text-success"
        >
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`${primaryButtonClass} w-full`}
      >
        {pending && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        Create account
      </button>
    </form>
  );
}
