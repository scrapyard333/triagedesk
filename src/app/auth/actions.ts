"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AuthState } from "@/lib/types";
import type { SignupField, SignupState } from "@/lib/auth-types";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(72, "Password must be 72 characters or fewer."),
});

const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, "Enter your full name.")
    .max(80, "Keep your name under 80 characters."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Use 72 characters or fewer.")
    .regex(/[A-Za-z]/, "Include at least one letter.")
    .regex(/\d/, "Include at least one number."),
});

const SIGNUP_FIELDS: string[] = ["full_name", "email", "password"];

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const raw = {
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
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

function friendlySignupError(message: string) {
  const text = message.toLowerCase();
  if (text.includes("already registered") || text.includes("already been")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (text.includes("signups are disabled") || text.includes("not allowed")) {
    return "Sign ups are turned off right now. Please try again later.";
  }
  if (text.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  return "We could not create your account. Please try again.";
}

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const values = {
    full_name: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
  };
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  const acknowledged = formData.get("ack") === "on";

  const fieldErrors: Partial<Record<SignupField, string>> = {};

  const parsed = signupSchema.safeParse({ ...values, password });
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        typeof key === "string" &&
        SIGNUP_FIELDS.includes(key) &&
        !fieldErrors[key as SignupField]
      ) {
        fieldErrors[key as SignupField] = issue.message;
      }
    }
  }

  if (!fieldErrors.password && confirm !== password) {
    fieldErrors.confirm_password = "Passwords do not match.";
  }
  if (!acknowledged) {
    fieldErrors.ack = "Please confirm this before creating your account.";
  }

  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.full_name } },
  });

  if (error) {
    console.error("Signup failed:", error.message);
    return { error: friendlySignupError(error.message), values };
  }

  if (!data.session) {
    return {
      message: "Account created. Check your email to confirm it, then sign in.",
      values,
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
