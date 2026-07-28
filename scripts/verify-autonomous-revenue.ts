import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } },
);

async function main() {
  const tables = [
    "outreach_campaigns",
    "outreach_sends",
    "outreach_events",
    "lead_scores",
    "auto_proposals",
    "content_schedule",
    "directory_listings",
    "revenue_events",
  ];

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) {
      console.error(`${table}: ERROR - ${error.message}`);
    } else {
      console.log(`${table}: ${count ?? 0} rows`);
    }
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
