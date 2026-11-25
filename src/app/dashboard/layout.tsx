import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { PageSkeleton } from "@/components/page-skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUser, requireUser } from "@/lib/auth";

async function UserName() {
  const user = await getUser();
  const fullName = user?.user_metadata?.full_name;
  const label =
    typeof fullName === "string" && fullName.trim() ? fullName : user?.email;

  return (
    <span className="hidden max-w-48 truncate text-sm text-muted sm:block">
      {label}
    </span>
  );
}

// Runs on the server for every dashboard page. Signed-out visitors are
// sent to /login (proxy.ts also does this before the page renders).
async function AuthGate({ children }: { children: ReactNode }) {
  await requireUser();
  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-5">
          <Link href="/dashboard" aria-label="TriageDesk dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Suspense
              fallback={
                <span
                  className="hidden h-4 w-40 animate-pulse rounded bg-surface-2 sm:block"
                  aria-hidden="true"
                />
              }
            >
              <UserName />
            </Suspense>
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
        <Suspense fallback={<PageSkeleton />}>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </main>
    </div>
  );
}
