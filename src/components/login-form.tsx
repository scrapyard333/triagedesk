"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { login } from "@/app/auth/actions";
import { PasswordInput } from "@/components/password-input";
import type { AuthState } from "@/lib/types";
import { inputClass, primaryButtonClass } from "@/lib/ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {} as AuthState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          placeholder="you@company.com"
          className={`${inputClass} h-11`}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Your password"
        />
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

      <button
        type="submit"
        disabled={pending}
        className={`${primaryButtonClass} w-full`}
      >
        {pending && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        Sign in
      </button>
    </form>
  );
}
