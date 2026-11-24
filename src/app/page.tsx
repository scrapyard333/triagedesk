import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: Sparkles,
    title: "Instant AI triage",
    text: "Every ticket gets a category, urgency and sentiment within seconds of arriving.",
  },
  {
    icon: MessageSquareText,
    title: "Draft replies",
    text: "Get a clear, friendly reply you can edit and send, so nobody starts from a blank page.",
  },
  {
    icon: Gauge,
    title: "Live insights",
    text: "See volume, urgency and trends at a glance and spot problems before they grow.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Row Level Security keeps tickets isolated for each team at the database level.",
  },
];

const steps = [
  {
    title: "Capture",
    text: "Customer messages land in one clean inbox.",
  },
  {
    title: "Triage",
    text: "Claude reads each ticket, labels it and explains why.",
  },
  {
    title: "Resolve",
    text: "Review the draft reply, edit if needed and close the ticket.",
  },
];

const toneClasses = {
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/10 text-primary",
  neutral: "bg-surface-2 text-muted",
} as const;

function Chip({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof toneClasses;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

export default function Home() {
  return (
    <div className="bg-glow min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link href="/" aria-label="TriageDesk home">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2">
            <a
              href="#features"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted transition hover:text-foreground sm:block"
            >
              Features
            </a>
            <a
              href="#how"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted transition hover:text-foreground sm:block"
            >
              How it works
            </a>
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl animate-fade-up text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-xs font-medium text-muted">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              AI support triage, powered by Claude
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Triage support tickets in{" "}
              <span className="gradient-text">seconds</span>, not hours.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted">
              Support teams drown in messages. TriageDesk labels every ticket by
              category, urgency and sentiment, then drafts the reply, so your
              team starts with the work that matters most.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-card transition hover:bg-primary-hover"
              >
                Get started
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#how"
                className="inline-flex h-11 items-center rounded-xl border bg-surface px-6 text-sm font-medium transition hover:bg-surface-2"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-card border bg-surface p-5 shadow-card">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Incoming ticket
              </p>
              <h2 className="mt-3 font-semibold">
                I was charged twice this month
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Hi, I just noticed two payments on my card for the same plan. I
                need this fixed today because my account is almost empty.
                Please help.
              </p>
              <p className="mt-4 text-xs text-muted">
                Sara Ahmed · sara@example.com
              </p>
            </div>

            <div className="rounded-card border bg-surface p-5 shadow-card">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                AI triage result
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip label="Billing" tone="primary" />
                <Chip label="Urgency: High" tone="danger" />
                <Chip label="Sentiment: Negative" tone="warning" />
                <Chip label="Confidence 94%" tone="accent" />
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                <span className="font-medium">Summary: </span>
                <span className="text-muted">
                  Customer was double charged and needs a refund today.
                </span>
              </p>
              <div className="mt-4 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-muted">
                Hi Sara, I am sorry about the double charge. I have flagged it
                for an immediate refund and you will see it within 1 to 2
                working days.
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16"
        >
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Everything a support team needs first
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-card border bg-surface p-5 shadow-card"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16"
        >
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-card border bg-surface p-5 shadow-card"
              >
                <span className="font-mono text-sm text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t py-8 text-sm text-muted">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 sm:flex-row">
          <span>© 2026 TriageDesk. Built by Kousar Abbas.</span>
          <a
            href="https://github.com/scrapyard333/triagedesk"
            className="transition hover:text-foreground"
          >
            View source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
