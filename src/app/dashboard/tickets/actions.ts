"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { TicketField, TicketFormState } from "@/lib/types";

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

  const { error } = await supabase.from("tickets").insert(parsed.data);
  if (error) {
    console.error("createTicket failed:", error.message);
    return {
      error: "We could not save the ticket. Please try again.",
      values,
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
