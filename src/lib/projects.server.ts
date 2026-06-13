import { supabase } from "@/integrations/supabase/client";

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  tags: string[] | null;
  live_url: string | null;
  featured: boolean | null;
  created_at: string | null;
};

export async function fetchProjects(): Promise<DbProject[]> {
  const { data, error } = await supabase.from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[projects] fetch failed", error);
    return [];
  }
  return data ?? [];
}

export async function fetchProjectBySlug(slug: string): Promise<DbProject | null> {
  const { data, error } = await supabase.from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[projects] fetch one failed", error);
    return null;
  }
  return data ?? null;
}
