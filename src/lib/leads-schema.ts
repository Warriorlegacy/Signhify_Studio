import { z } from "zod";

/**
 * Lead wizard schema — single source of truth for the contact form,
 * future Supabase `leads` table mapping, and any admin view.
 *
 * Keep field names stable; downstream consumers (CRM sync, analytics)
 * will rely on them.
 */
export const leadSchema = z.object({
  type: z.string().trim().min(1, "Pick a project type"),
  scope: z.string().trim().min(1, "Pick a scope"),
  budget: z.string().trim().min(1, "Pick a budget band"),
  timeline: z.string().trim().min(1, "Pick a timeline"),
  goals: z.array(z.string()).min(1, "Pick at least one goal").max(8),
  name: z.string().trim().min(2, "Name is too short").max(120, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(200, "Email is too long"),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type Lead = z.infer<typeof leadSchema>;

export const emptyLead: Lead = {
  type: "",
  scope: "",
  budget: "",
  timeline: "",
  goals: [],
  name: "",
  email: "",
  company: "",
  message: "",
};
