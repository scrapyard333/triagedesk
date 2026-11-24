"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AuthState } from "@/lib/types";

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const raw = readCredentials(formData);
  const parsed = credentialsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, email: raw.email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const needsConfirm = error.message.toLowerCase().includes("confirm");
    return {
      error: needsConfirm
        ? "Please confirm your email first, then sign in."
        : "Incorrect email or password.",
      email: raw.email,
    };
  }

  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const raw = readCredentials(formData);
  const parsed = credentialsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, email: raw.email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) {
    return { error: error.message, email: raw.email };
  }

  if (!data.session) {
    return {
      message: "Account created. Check your email to confirm it, then sign in.",
      email: raw.email,
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
