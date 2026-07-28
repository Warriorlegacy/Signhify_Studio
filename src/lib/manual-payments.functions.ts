import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createManualPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const amount = typeof obj.amount === "number" && obj.amount > 0 ? obj.amount : NaN;
    const method =
      typeof obj.method === "string" && ["upi", "bank_transfer", "paypal"].includes(obj.method)
        ? obj.method
        : "";
    const description = typeof obj.description === "string" ? obj.description.trim() : "";
    const transactionRef = typeof obj.transactionRef === "string" ? obj.transactionRef.trim() : "";
    if (isNaN(amount)) throw new Error("Amount must be a positive number.");
    if (!method) throw new Error("Payment method must be upi, bank_transfer, or paypal.");
    if (!transactionRef) throw new Error("Transaction reference ID is required.");
    return { amount, method, description, transactionRef };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await (supabase as any).from("manual_payments").insert({
      user_id: userId,
      amount: data.amount,
      method: data.method,
      currency: "INR",
      description: data.description || null,
      transaction_ref: data.transactionRef,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyManualPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await (supabase as any)
      .from("manual_payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { payments: data ?? [] };
  });
