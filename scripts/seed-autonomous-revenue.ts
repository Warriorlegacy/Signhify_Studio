import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } },
);

async function main() {
  const outreachDir = path.join(process.cwd(), "scripts", "generated-outreach");
  const files = fs.readdirSync(outreachDir).filter((f) => f.endsWith(".txt") && !f.includes("summary"));
  const prospects = new Map<string, { cold?: string; followup?: string; partnership?: string }>();

  for (const file of files) {
    const baseName = file.replace(/\.(cold|followup|partnership)\.txt$/, "");
    const prospectName = baseName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const variant = file.includes("cold")
      ? "cold"
      : file.includes("followup")
        ? "followup"
        : "partnership";
    const content = fs.readFileSync(path.join(outreachDir, file), "utf8");
    const subjectMatch = content.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch?.[1]?.trim() ?? "No subject";
    const bodyMatch = content.match(/Body:\s*([\s\S]+)/i);
    const body = bodyMatch?.[1]?.trim() ?? content;

    if (!prospects.has(baseName)) prospects.set(baseName, {});
    const entry = prospects.get(baseName)!;
    if (variant === "cold") entry.cold = body;
    else if (variant === "followup") entry.followup = body;
    else entry.partnership = body;

    const { error: sendError } = await supabase.from("outreach_sends").insert({
      prospect_name: prospectName,
      prospect_email: "",
      company: baseName,
      template_key: variant,
      subject,
      body,
      status: "queued",
      scheduled_at: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (sendError) console.error(`Failed to insert ${file}:`, sendError.message);
  }

  const { data: campaigns, error: campError } = await supabase
    .from("outreach_campaigns")
    .select("id")
    .eq("name", "Initial Outreach");

  let campaignId = campaigns?.[0]?.id;
  if (!campaignId && !campError) {
    const { data: created, error: createError } = await supabase
      .from("outreach_campaigns")
      .insert({
        name: "Initial Outreach",
        channel: "email",
        status: "active",
        cadence_days: 3,
        max_steps: 3,
        metadata: { source: "seed-script" },
      })
      .select("id")
      .single();

    if (createError) console.error("Campaign insert failed:", createError.message);
    else campaignId = created.id;
  }

  if (campaignId) {
    const { error: updateError } = await supabase
      .from("outreach_sends")
      .update({ campaign_id: campaignId })
      .is("campaign_id", null);

    if (updateError) console.error("Campaign link failed:", updateError.message);
  }

  const directoryJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "directory-listings.json"), "utf8"),
  );
  const listings = Array.isArray(directoryJson)
    ? directoryJson
    : Array.isArray(directoryJson.directories)
      ? directoryJson.directories
      : [];

  for (const listing of listings) {
    const { error } = await supabase.from("directory_listings").upsert(
      {
        platform: listing.name ?? listing.platform ?? "Unknown",
        url: listing.url ?? "",
        status: listing.status ?? "pending",
        priority: listing.priority === "high" ? 1 : listing.priority === "medium" ? 5 : 10,
        notes: listing.notes ?? null,
        metadata: listing,
      },
      { onConflict: "platform" },
    );

    if (error) console.error(`Directory listing failed for ${listing.name ?? listing.platform}:`, error.message);
  }

  const linkedinJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "linkedin-posts.json"), "utf8"),
  );
  const posts = Array.isArray(linkedinJson)
    ? linkedinJson
    : Array.isArray(linkedinJson.posts)
      ? linkedinJson.posts
      : [];

  for (const post of posts) {
    const scheduledAt = post.scheduledAt ?? post.scheduled_at ?? post.date ?? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("content_schedule").insert({
      title: post.topic ?? post.title ?? "Untitled",
      body: post.content ?? post.body ?? post.copy ?? "",
      platform: "linkedin",
      status: "scheduled",
      scheduled_at: scheduledAt,
      metadata: post,
    });

    if (error) console.error("Content schedule insert failed:", error.message);
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
