import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-5">
          <Link href="/dashboard" aria-label="TriageDesk dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-48 truncate text-sm text-muted sm:block">
              {user.email}
            </span>
            <ThemeToggle />
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-lg border bg-surface px-3 text-sm text-muted transition hover:text-foreground"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
