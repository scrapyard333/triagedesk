"use client";

import { useRef, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Search, X } from "lucide-react";
import { CATEGORY_LABEL, STATUS_LABEL, URGENCY_LABEL } from "@/lib/types";
import { inputClass } from "@/lib/ui";

type Props = {
  initial: { q: string; status: string; category: string; urgency: string };
};

const KEYS = ["q", "status", "category", "urgency"] as const;
const selectClass = `${inputClass} h-10 w-full sm:w-auto`;

export function TicketFilters({ initial }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, startTransition] = useTransition();

  const active = KEYS.some((key) => initial[key] !== "");

  function submit(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const key of KEYS) {
      const value = String(data.get(key) ?? "").trim();
      if (value) {
        params.set(key, value);
      }
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/dashboard?${query}` : "/dashboard", {
        scroll: false,
      });
    });
  }

  function onChange(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (target.name === "q") {
      // Wait until typing pauses before searching.
      timer.current = setTimeout(() => submit(form), 350);
    } else {
      submit(form);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timer.current) {
      clearTimeout(timer.current);
    }
    submit(event.currentTarget);
  }

  function clearAll() {
    const form = formRef.current;
    if (!form) {
      return;
    }
    for (const element of Array.from(form.elements)) {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement
      ) {
        element.value = "";
      }
    }
    submit(form);
  }

  return (
    <form
      ref={formRef}
      onChange={onChange}
      onSubmit={onSubmit}
      role="search"
      aria-label="Filter tickets"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <div className="relative min-w-0 flex-1 sm:min-w-64">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          name="q"
          defaultValue={initial.q}
          maxLength={100}
          placeholder="Search subject, name or email"
          aria-label="Search tickets"
          className={`${inputClass} h-10 pl-9`}
        />
      </div>

      <select
        name="status"
        defaultValue={initial.status}
        aria-label="Filter by status"
        className={selectClass}
      >
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        name="category"
        defaultValue={initial.category}
        aria-label="Filter by category"
        className={selectClass}
      >
        <option value="">All categories</option>
        {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        name="urgency"
        defaultValue={initial.urgency}
        aria-label="Filter by urgency"
        className={selectClass}
      >
        <option value="">All urgencies</option>
        {Object.entries(URGENCY_LABEL)
          .reverse()
          .map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
      </select>

      {pending && (
        <LoaderCircle
          className="size-4 animate-spin text-muted"
          aria-label="Updating results"
        />
      )}

      {active && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border bg-surface px-3 text-sm text-muted transition hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </button>
      )}
    </form>
  );
}
