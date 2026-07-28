import "dotenv/config";
import { Client } from "pg";
import fs from "node:fs";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

async function main() {
  if (!connectionString) {
    console.error("Missing DIRECT_URL or DATABASE_URL");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  const sql = fs.readFileSync("supabase/migrations/20260729000003_autonomous_revenue.sql", "utf8");
  const lines = sql.split("\n");

  const statements: string[] = [];
  let buffer = "";
  let inCreate = false;

  for (const line of lines) {
    const trimmed = line.trim();
    buffer += line + "\n";

    if (trimmed.startsWith("CREATE TABLE") || trimmed.startsWith("CREATE UNIQUE INDEX") || trimmed.startsWith("CREATE INDEX")) {
      inCreate = true;
    }

    if (trimmed.endsWith(";")) {
      if (inCreate) {
        if (trimmed === ");" || trimmed.startsWith(");")) {
          inCreate = false;
          const stmt = buffer.trim();
          if (stmt) {
            statements.push(stmt);
          }
          buffer = "";
        }
      } else if (!trimmed.startsWith("--")) {
        const stmt = buffer.trim();
        if (stmt) {
          statements.push(stmt);
        }
        buffer = "";
      }
    }
  }

  for (const statement of statements) {
    const preview = statement.replace(/\s+/g, " ").slice(0, 80);
    console.log("Executing:", preview + "...");
    try {
      await client.query(statement);
      console.log("OK");
    } catch (err) {
      console.error("Error:", (err as Error).message);
    }
  }

  await client.end();
  console.log("Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
