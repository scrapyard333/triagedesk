"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { triageTicket } from "@/lib/ai/triage";
import { createClient } from "@/lib/supabase/server";
import type { TicketField, TicketFormState } from "@/lib/types";

// Protects your free AI quota: each user gets this many AI triages per day.
const DAILY_TRIAGE_LIMIT = 25;

type Db = Awaited<ReturnType<typeof createClient>>;

async function runTriage(
  supabase: Db,
  id: string,
  ticket: { customer_name: string; subject: string; body: string },
): Promise<boolean> {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("tickets")
      .select("id", { count: "exact", head: true })
      .gte("triaged_at", since);
    if ((count ?? 0) >= DAILY_TRIAGE_LIMIT) {
      return false;
    }

    const result = await triageTicket(ticket);
    const { error } = await supabase
      .from("tickets")
      .update({
        category: result.category,
        urgency: result.urgency,
        sentiment: result.sentiment,
        summary: result.summary,
        suggested_reply: result.suggested_reply,
        ai_confidence: result.confidence,
        triaged_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Saving triage failed:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "AI triage failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return false;
  }
}

const ticketSchema = z.object({
  customer_name: z
    .string()
    .min(1, "Enter the customer's name.")
    .max(120, "Keep the name under 120 characters."),
  customer_email: z.email("Enter a valid email address."),
  subject: z
    .string()
    .min(1, "Enter a subject.")
    .max(200, "Keep the subject under 200 characters."),
  body: z
    .string()
    .min(1, "Enter the customer's message.")
    .max(8000, "Keep the message under 8000 characters."),
});

const FIELDS: string[] = [
  "customer_name",
  "customer_email",
  "subject",
  "body",
];

export async function createTicket(
  _prev: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  const values: Record<TicketField, string> = {
    customer_name: String(formData.get("customer_name") ?? "").trim(),
    customer_email: String(formData.get("customer_email") ?? "")
      .trim()
      .toLowerCase(),
    subject: String(formData.get("subject") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
  };

  const parsed = ticketSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<TicketField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        typeof key === "string" &&
        FIELDS.includes(key) &&
        !fieldErrors[key as TicketField]
      ) {
        fieldErrors[key as TicketField] = issue.message;
      }
    }
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error || !data) {
    console.error("createTicket failed:", error?.message);
    return {
      error: "We could not save the ticket. Please try again.",
      values,
    };
  }

  // The ticket is already saved. If the AI fails, the dashboard shows a retry button.
  await runTriage(supabase, data.id, parsed.data);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function retryTriage(formData: FormData): Promise<void> {
  const parsedId = z.uuid().safeParse(String(formData.get("id") ?? ""));
  if (!parsedId.success) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("tickets")
    .select("customer_name, subject, body")
    .eq("id", parsedId.data)
    .single();
  if (error || !data) {
    return;
  }

  await runTriage(supabase, parsedId.data, data);
  revalidatePath("/dashboard");
}
