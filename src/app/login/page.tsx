import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your TriageDesk workspace."
      footer={
        <>
          New here?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="login" action={login} />
    </AuthShell>
  );
}
