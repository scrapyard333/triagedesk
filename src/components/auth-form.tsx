"use client";

import { useActionState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import type { AuthState } from "@/lib/types";
import { inputClass, primaryButtonClass } from "@/lib/ui";

type Props = {
  mode: "login" | "signup";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
};

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {} as AuthState);
  const isLogin = mode === "login";

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
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={8}
          placeholder={isLogin ? "Your password" : "At least 8 characters"}
          className={`${inputClass} h-11`}
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
        {isLogin ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
