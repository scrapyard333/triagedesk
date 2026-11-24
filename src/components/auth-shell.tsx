import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

type Props = {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, footer, children }: Props) {
  return (
    <div className="bg-glow flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="TriageDesk home">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md animate-fade-up">
          <div className="rounded-card border bg-surface p-6 shadow-card sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
          <p className="mt-5 text-center text-sm text-muted">{footer}</p>
        </div>
      </main>
    </div>
  );
}
