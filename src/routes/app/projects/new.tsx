import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { createProject } from "@/lib/projects.functions";
export const Route = createFileRoute("/app/projects/new")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [
      { title: "New Project — Signhify" },
      {
        name: "description",
        content: "Create a new Signhify Cloud project with title and project brief.",
      },
      { property: "og:url", content: "https://signhify.online/app/projects/new" },
      { property: "og:title", content: "New Project — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/app/projects/new" }],
  }),
  component: NewProject,
});
const schema = z.object({ title: z.string().min(3), description: z.string().optional() });
function NewProject() {
  const nav = useNavigate();
  const create = useServerFn(createProject);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <form
        onSubmit={form.handleSubmit(async (v) => {
          const r = await create({ data: v });
          await nav({ to: "/app/projects/$id", params: { id: r.id } });
        })}
        className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-7"
      >
        <h1 className="font-display text-3xl font-bold">New Project</h1>
        <input
          {...form.register("title")}
          placeholder="Project title"
          className="mt-6 w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none"
        />
        <textarea
          {...form.register("description")}
          placeholder="Description"
          className="mt-3 min-h-36 w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none"
        />
        <button
          disabled={form.formState.isSubmitting}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          {form.formState.isSubmitting && <Loader2 size={14} className="animate-spin" />}Create
          project
        </button>
      </form>
    </section>
  );
}
