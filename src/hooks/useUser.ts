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
    const providerCheck = await fetch("/api/public/auth-provider?provider=google", {
      headers: { accept: "application/json" },
    })
      .then((r) => r.json())
      .catch(() => null);

    if (providerCheck?.enabled === false) {
      return {
        data: { provider: "google" as const, url: null },
        error: new AuthError(
          providerCheck.message || "Google sign-in is not enabled for this Supabase project yet.",
          400,
          "provider_not_enabled",
        ),
      };
    }

    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true },
    });

    if (res.error || !res.data.url) return res;
    window.location.assign(res.data.url);
    return res;
  }, []);
  const signOut = useCallback(() => supabase.auth.signOut(), []);

  return { user, session, loading, signIn, signUp, signOut, signInWithGoogle };
}
