import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { SignupForm } from "@/components/signup-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { TriageBadges } from "@/components/triage-badges";

export const metadata: Metadata = { title: "Create account" };

const benefits = [
  {
    icon: Sparkles,
    title: "Every ticket labeled in seconds",
    text: "Category, urgency and sentiment, with a confidence score.",
  },
  {
    icon: MessageSquareText,
    title: "A draft reply for every message",
    text: "Edit it, send it, and skip the blank page.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Row Level Security keeps your tickets yours alone.",
  },
];

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="bg-glow relative hidden flex-col justify-between border-r bg-surface-2/40 p-12 lg:flex">
        <Link href="/" aria-label="TriageDesk home">
          <Logo />
        </Link>

        <div className="max-w-md">
          <h2 className="text-balance text-3xl font-semibold tracking-tight">
            Your support inbox, <span className="gradient-text">sorted by AI</span>{" "}
            before you open it.
          </h2>

          <ul className="mt-8 space-y-5">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-0.5 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-card border bg-surface p-4 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Example triage
            </p>
            <p className="mt-2 text-sm font-medium">
              &ldquo;I was charged twice this month&rdquo;
            </p>
            <div className="mt-3">
              <TriageBadges
                ticket={{
                  category: "billing",
                  urgency: "high",
                  sentiment: "negative",
                  ai_confidence: 0.94,
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted">
          A free demo project by Kousar Abbas. No card needed.
        </p>
      </aside>

      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between px-5 lg:justify-end">
          <Link href="/" aria-label="TriageDesk home" className="lg:hidden">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-5 pb-12">
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Set up your workspace and triage your first ticket in minutes.
            </p>
            <div className="mt-8">
              <SignupForm />
            </div>
            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
