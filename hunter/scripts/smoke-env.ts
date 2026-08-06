import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.HUNTER_DB_PATH = join(mkdtempSync(join(tmpdir(), "hunter-smoke-")), "smoke.db");
process.env.HUNTER_SANDBOX = "true";
process.env.HUNTER_SITE_URL = "http://localhost:3001";
