// Browser-safe Supabase client with graceful fallback.
// - Validates env vars at first use with a clear, actionable error.
// - Returns a stub client when unavailable so React rendering never crashes
//   (DB calls resolve to `{ data: null, error }` instead of throwing).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

type AnyClient = SupabaseClient<Database>;

function readEnv() {
  const url =
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined);
  const key =
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (typeof process !== "undefined" ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined);
  return { url, key };
}

function validate(url?: string, key?: string): string | null {
  const missing = [
    ...(!url ? ["VITE_SUPABASE_URL"] : []),
    ...(!key ? ["VITE_SUPABASE_PUBLISHABLE_KEY"] : []),
  ];
  if (missing.length) {
    return `Missing Supabase env var(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
  }
  try {
    const u = new URL(url!);
    if (!/^https?:$/.test(u.protocol)) return `Invalid SUPABASE_URL protocol: ${u.protocol}`;
  } catch {
    return `Invalid SUPABASE_URL: ${url}`;
  }
  if (key!.length < 20) return "Invalid SUPABASE_PUBLISHABLE_KEY (too short).";
  return null;
}

function buildStub(reason: string): AnyClient {
  const err = { message: `Supabase unavailable: ${reason}`, name: "SupabaseUnavailable" };
  const queryStub: any = {
    select: () => queryStub,
    insert: () => queryStub,
    update: () => queryStub,
    delete: () => queryStub,
    upsert: () => queryStub,
    eq: () => queryStub,
    neq: () => queryStub,
    in: () => queryStub,
    order: () => queryStub,
    limit: () => queryStub,
    single: () => Promise.resolve({ data: null, error: err }),
    maybeSingle: () => Promise.resolve({ data: null, error: err }),
    then: (resolve: (v: any) => void) => resolve({ data: null, error: err }),
  };
  const stub = {
    from: () => queryStub,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: err }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: err }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: { from: () => ({ upload: () => Promise.resolve({ data: null, error: err }) }) },
    functions: { invoke: () => Promise.resolve({ data: null, error: err }) },
  };
  return stub as unknown as AnyClient;
}

let _client: AnyClient | undefined;

function getClient(): AnyClient {
  if (_client) return _client;
  const { url, key } = readEnv();
  const problem = validate(url, key);
  if (problem) {
    console.error(`[Supabase] ${problem}`);
    _client = buildStub(problem);
    return _client;
  }
  _client = createClient<Database>(url!, key!, {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
    },
  });
  return _client;
}

// Import like: import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as AnyClient, {
  get(_, prop, receiver) {
    return Reflect.get(getClient() as object, prop, receiver);
  },
});

export function getSupabaseStatus(): { ok: boolean; reason: string | null } {
  const { url, key } = readEnv();
  const problem = validate(url, key);
  return { ok: !problem, reason: problem };
}
