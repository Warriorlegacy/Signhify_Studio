import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { createPortalSession } from "@/lib/stripe-portal.functions";
import { softDeleteProfile } from "@/lib/profile.functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AiKeysPanel from "@/components/settings/AiKeysPanel";
export const Route = createFileRoute("/app/settings")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [
      { title: "Settings — Signhify" },
      {
        name: "description",
        content:
          "Manage your Signhify profile, avatar, billing portal, connected accounts, and account deletion settings.",
      },
      { property: "og:url", content: "https://signhify.online/app/settings" },
      { property: "og:title", content: "Settings — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/app/settings" }],
  }),
  component: SettingsPage,
});
function SettingsPage() {
  const { user, signOut } = useUser();
  const nav = useNavigate();
  const file = useRef<HTMLInputElement>(null);
  const portal = useServerFn(createPortalSession);
  const del = useServerFn(softDeleteProfile);
  const [name, setName] = useState(String(user?.user_metadata?.full_name ?? ""));
  const [confirm, setConfirm] = useState("");
  const avatar = String(user?.user_metadata?.avatar_url ?? "");
  const upload = async (f: File) => {
    if (!user) return;
    const ext = f.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    await supabase.storage.from("avatars").upload(path, f, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
  };
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-black">Settings</h1>
        <Tabs defaultValue="profile" className="mt-8">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai-keys">AI Keys</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div>
                <img
                  src={avatar || "/favicon.ico"}
                  alt="Avatar"
                  loading="lazy"
                  decoding="async"
                  width="80"
                  height="80"
                  className="h-20 w-20 rounded-full border border-border"
                />
                <input
                  ref={file}
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                />
                <button
                  onClick={() => file.current?.click()}
                  className="mt-3 rounded-md border border-border bg-surface px-4 py-2 text-sm"
                >
                  Change photo
                </button>
              </div>
              <label className="block text-sm">
                Display name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </label>
              <button
                onClick={() => supabase.auth.updateUser({ data: { full_name: name } })}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Save
              </button>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
            </div>
          </TabsContent>
          <TabsContent value="billing">
            <div className="rounded-2xl border border-border bg-card p-6">
              <button
                onClick={async () => {
                  const r = await portal({ data: undefined });
                  window.location.href = r.url;
                }}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Manage subscription
              </button>
              <p className="mt-4 text-sm text-muted-foreground">
                Manage your plan, invoices, and payment method through the Stripe portal.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="danger">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-6">
              <Dialog>
                <DialogTrigger className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Delete account
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Type DELETE to confirm</DialogTitle>
                  </DialogHeader>
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="rounded-md border border-border bg-surface px-3 py-2"
                  />
                  <button
                    disabled={confirm !== "DELETE"}
                    onClick={async () => {
                      await del({ data: undefined });
                      await signOut();
                      await nav({ to: "/" });
                    }}
                    className="rounded-md bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Confirm delete
                  </button>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
