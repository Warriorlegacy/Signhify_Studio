import { useCallback, useEffect, useState } from "react";
import { AuthError, type Session, type User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    [],
  );
  const signUp = useCallback(
    (email: string, password: string, emailRedirectTo = `${window.location.origin}/login`) =>
      supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      }),
    [],
  );
  const signInWithGoogle = useCallback(async (redirectTo = `${window.location.origin}/app`) => {
      const res = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (res.error || !res.data.url) return res;

      try {
        const probe = await fetch(res.data.url, { method: "GET", redirect: "manual" });
        if (probe.status >= 400) {
          const payload = await probe.json().catch(() => null);
          return {
            data: res.data,
            error: new AuthError(
                payload?.msg ||
                payload?.message ||
                "Google sign-in is not enabled for this Supabase project yet.",
              probe.status,
              "provider_not_enabled",
            ),
          };
        }
      } catch {
        // If the browser blocks the preflight check, continue with the OAuth redirect.
      }

      window.location.assign(res.data.url);
      return res;
    }, []);
  const signOut = useCallback(() => supabase.auth.signOut(), []);

  return { user, session, loading, signIn, signUp, signOut, signInWithGoogle };
}
