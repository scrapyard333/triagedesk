"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
        <TriangleAlert className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        An unexpected error happened. You can try again, or go back to the home
        page.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-card transition hover:bg-primary-hover"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl border bg-surface px-5 text-sm font-medium transition hover:bg-surface-2"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
