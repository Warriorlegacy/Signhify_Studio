import { redirect } from "@tanstack/react-router";

export async function requireAppAuth({
  location,
}: {
  location: { pathname: string; searchStr?: string };
}) {
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem("sb-auth-token") ?? "";
    if (!raw && !document.cookie.includes("sb-")) {
      throw redirect({
        to: "/login",
        search: { redirect: `${location.pathname}${location.searchStr ?? ""}` },
      });
    }
    return;
  }
  // TODO(auth-guard): Lovable's generated auth middleware exposes request-scoped clients to server functions, not route beforeLoad. Client-side guard handles app navigation until the broker exposes SSR route sessions.
}
