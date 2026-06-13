import { redirect } from "@tanstack/react-router";

export async function requireAppAuth({
  location,
}: {
  location: { pathname: string; searchStr?: string };
}) {
  if (typeof window !== "undefined") {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/login",
        search: { redirect: `${location.pathname}${location.searchStr ?? ""}` },
      });
    }
    return { user: data.user };
  }
  // TODO(auth-guard): Lovable's generated auth middleware exposes request-scoped clients to server functions, not route beforeLoad. Client-side guard handles app navigation until the broker exposes SSR route sessions.
}
