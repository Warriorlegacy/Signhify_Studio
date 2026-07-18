export type SprintStatus = "done" | "in_progress" | "todo" | "blocked";

export type SprintItem = {
  id: string;
  title: string;
  detail: string;
  owner: string;
  status: SprintStatus;
  due: string;
};

export type SprintTrack = {
  key: string;
  name: string;
  window: string;
  subdomain: string;
  summary: string;
  items: SprintItem[];
};

export const sprintTracks: SprintTrack[] = [
  {
    key: "studio",
    name: "Signhify Studio",
    window: "Week 1 · June 1–7",
    subdomain: "signhify.dpdns.org",
    summary: "The Phase 1 marketing site, portfolio of 14 projects, and lead capture.",
    items: [
      {
        id: "studio-hero",
        title: "Cinematic hero + particle bg",
        detail: "tsparticles canvas, gradient orbs, CTA above the fold.",
        owner: "Piyush",
        status: "done",
        due: "Jun 5",
      },
      {
        id: "studio-projects",
        title: "All 14 projects seeded",
        detail: "Project objects + grid + filters live on /projects.",
        owner: "Piyush",
        status: "done",
        due: "Jun 6",
      },
      {
        id: "studio-services",
        title: "Services + Process sections",
        detail: "Engagement model, deliverables, pricing tiers.",
        owner: "Piyush",
        status: "done",
        due: "Jun 6",
      },
      {
        id: "studio-vision",
        title: "Vision page + roadmap",
        detail: "June sprint timeline + ecosystem layers.",
        owner: "Piyush",
        status: "done",
        due: "Jun 6",
      },
      {
        id: "studio-lead",
        title: "Contact form → Supabase",
        detail: "Server fn writes lead, sends notification email.",
        owner: "Piyush",
        status: "done",
        due: "Jun 7",
      },
      {
        id: "studio-seo",
        title: "Per-route meta + sitemap",
        detail: "Distinct og:title/description on every public route.",
        owner: "Piyush",
        status: "done",
        due: "Jun 7",
      },
      {
        id: "studio-msme",
        title: "MSME trust badge in footer",
        detail: "UDYAM-BR-08-0036671 displayed on every page.",
        owner: "Piyush",
        status: "done",
        due: "Jun 5",
      },
      {
        id: "studio-publish",
        title: "Publish signhify.dpdns.org",
        detail: "Custom domain wired, SSL green, OG previews verified.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 7",
      },
    ],
  },
  {
    key: "ai",
    name: "Signhify AI",
    window: "Week 2 · June 8–14",
    subdomain: "ai.signhify.dpdns.org",
    summary: "Prompt → AI-generated product plan via Claude with streaming UI.",
    items: [
      {
        id: "ai-prompt",
        title: "Claude system prompt locked",
        detail: "Versioned in repo, JSON output schema defined.",
        owner: "Piyush",
        status: "done",
        due: "Jun 9",
      },
      {
        id: "ai-stream",
        title: "Streaming UI",
        detail: "Server route streams tokens to client renderer.",
        owner: "Piyush",
        status: "done",
        due: "Jun 11",
      },
      {
        id: "ai-rate",
        title: "Rate limit: 3 free builds",
        detail: "Per-IP + per-user counter in Supabase.",
        owner: "Piyush",
        status: "done",
        due: "Jun 12",
      },
      {
        id: "ai-save",
        title: "Save + share plan",
        detail: "Plans persisted, shareable public URL.",
        owner: "Piyush",
        status: "done",
        due: "Jun 13",
      },
      {
        id: "ai-publish",
        title: "Publish ai.signhify.dpdns.org",
        detail: "Subdomain routed, analytics on.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 14",
      },
    ],
  },
  {
    key: "deploy",
    name: "Signhify Deploy",
    window: "Week 3 · June 15–17",
    subdomain: "deploy.signhify.dpdns.org",
    summary: "GitHub repo → 1-click Vercel deploy with status dashboard.",
    items: [
      {
        id: "deploy-gh",
        title: "GitHub OAuth App approved",
        detail: "Apply TODAY — approval can take days.",
        owner: "Piyush",
        status: "blocked",
        due: "Jun 5",
      },
      {
        id: "deploy-vercel",
        title: "Vercel REST integration",
        detail: "POST /v13/deployments wired with project linking.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 16",
      },
      {
        id: "deploy-status",
        title: "Status dashboard",
        detail: "Live build logs + URL preview after success.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 17",
      },
    ],
  },
  {
    key: "marketplace",
    name: "Signhify Marketplace",
    window: "Week 3 · June 18–21",
    subdomain: "marketplace.signhify.dpdns.org",
    summary: "Browse + download 10+ launch templates derived from the 14 projects.",
    items: [
      {
        id: "mp-templates",
        title: "Package 10 launch templates",
        detail: "Repackage existing projects as cloneable starters.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 19",
      },
      {
        id: "mp-browse",
        title: "Browse + filter UI",
        detail: "Category, stack, tag filters with search.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 20",
      },
      {
        id: "mp-submit",
        title: "Community submit form",
        detail: "Form → Supabase review queue.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 21",
      },
    ],
  },
  {
    key: "cloud",
    name: "Signhify Cloud",
    window: "Week 4 · June 22–28",
    subdomain: "cloud.signhify.dpdns.org",
    summary: "Supabase Management API wrapper: DB, storage, auth visible per project.",
    items: [
      {
        id: "cloud-list",
        title: "List user projects",
        detail: "Supabase mgmt API → project list view.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 24",
      },
      {
        id: "cloud-db",
        title: "DB + storage + auth tabs",
        detail: "Read-only inspector for each resource.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 27",
      },
      {
        id: "cloud-publish",
        title: "Publish cloud.signhify.dpdns.org",
        detail: "Auth gate + analytics live.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 28",
      },
    ],
  },
  {
    key: "os",
    name: "Signhify OS",
    window: "Week 4 · June 29–30",
    subdomain: "os.signhify.dpdns.org",
    summary: "Unified dashboard: CRM, Projects, AI shortcuts, full Signhify nav.",
    items: [
      {
        id: "os-dash",
        title: "Unified dashboard shell",
        detail: "Sidebar nav, widgets, stitched Supabase data.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 29",
      },
      {
        id: "os-launch",
        title: "Launch June 30",
        detail: "All six subdomains live, announcement post.",
        owner: "Piyush",
        status: "todo",
        due: "Jun 30",
      },
    ],
  },
];

export const statusMeta: Record<SprintStatus, { label: string; dot: string; pill: string }> = {
  done: {
    label: "Done",
    dot: "bg-emerald-400",
    pill: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  in_progress: {
    label: "In progress",
    dot: "bg-primary",
    pill: "border-primary/50 bg-primary/10 text-primary",
  },
  todo: {
    label: "Todo",
    dot: "bg-muted-foreground/60",
    pill: "border-border text-muted-foreground",
  },
  blocked: {
    label: "Blocked",
    dot: "bg-red-400",
    pill: "border-red-500/40 bg-red-500/10 text-red-300",
  },
};
