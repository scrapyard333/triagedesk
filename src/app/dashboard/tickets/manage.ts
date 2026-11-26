"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { retryTriage } from "@/app/dashboard/tickets/actions";
import type { ReplyState } from "@/lib/manage-types";
import { createClient } from "@/lib/supabase/server";

const idSchema = z.uuid();
const statusSchema = z.enum(["open", "in_progress", "resolved"]);

async function requireClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return supabase;
}

function refresh(id: string) {
  revalidatePath(`/dashboard/tickets/${id}`);
  revalidatePath("/dashboard");
}

export async function updateStatus(formData: FormData): Promise<void> {
  const id = idSchema.safeParse(String(formData.get("id") ?? ""));
  const status = statusSchema.safeParse(String(formData.get("status") ?? ""));
  if (!id.success || !status.success) {
    return;
  }

  const supabase = await requireClient();
  const { error } = await supabase
    .from("tickets")
    .update({ status: status.data })
    .eq("id", id.data);
  if (error) {
    console.error("updateStatus failed:", error.message);
  }
  refresh(id.data);
}

export async function saveReply(
  ticketId: string,
  reply: string,
): Promise<ReplyState> {
  const id = idSchema.safeParse(ticketId);
  if (!id.success) {
    return { error: "Ticket not found." };
  }

  const text = reply.trim();
  if (text.length === 0) {
    return { error: "The reply cannot be empty." };
  }
  if (text.length > 2000) {
    return { error: "Keep the reply under 2000 characters." };
  }

  const supabase = await requireClient();
  const { error } = await supabase
    .from("tickets")
    .update({ suggested_reply: text })
    .eq("id", id.data);
  if (error) {
    console.error("saveReply failed:", error.message);
    return { error: "We could not save the reply. Please try again." };
  }

  refresh(id.data);
  return {};
}

export async function deleteTicket(formData: FormData): Promise<void> {
  const id = idSchema.safeParse(String(formData.get("id") ?? ""));
  if (!id.success) {
    return;
  }

  const supabase = await requireClient();
  const { error } = await supabase.from("tickets").delete().eq("id", id.data);
  if (error) {
    console.error("deleteTicket failed:", error.message);
    return;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function rerunTriage(formData: FormData): Promise<void> {
  const id = idSchema.safeParse(String(formData.get("id") ?? ""));
  if (!id.success) {
    return;
  }

  await retryTriage(formData);
  refresh(id.data);
}
