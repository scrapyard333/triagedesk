import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="bg-glow flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Link href="/" aria-label="TriageDesk home">
        <Logo />
      </Link>
      <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you are looking for does not exist or was moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-card transition hover:bg-primary-hover"
        >
          Go to dashboard
        </Link>
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
