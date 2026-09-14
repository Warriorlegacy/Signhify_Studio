import { describe, it } from "node:test";
import assert from "node:assert";
import {
  validateStrategistOutput,
  validateArchitectOutput,
  validateDesignerOutput,
  validateFrontendOutput,
  validateBackendOutput,
  validateDeploymentOutput,
} from "../../src/lib/orchestrator-validation";

describe("orchestrator agent validation", () => {
  it("strategist accepts valid JSON and enforces keyFeatures >= 3", () => {
    const out = validateStrategistOutput(
      JSON.stringify({ productName: "GymFlow", oneLiner: "Gym CRM", targetAudience: "gym owners", keyFeatures: ["A", "B", "C"] }),
    );
    assert.strictEqual(out.productName, "GymFlow");
    assert.strictEqual(out.keyFeatures.length, 3);
  });

  it("strategist rejects missing fields", () => {
    assert.throws(() => validateStrategistOutput(JSON.stringify({ productName: "X" })));
  });

  it("architect accepts SQL with CREATE TABLE and TS with export", () => {
    const out = validateArchitectOutput(
      JSON.stringify({ supabaseMigration: "CREATE TABLE tasks (id uuid);", typescriptTypes: "export type Task = { id: string };", apiRoutes: ["/api/tasks"] }),
    );
    assert.ok(out.supabaseMigration.includes("CREATE TABLE"));
    assert.ok(out.typescriptTypes.includes("export"));
    assert.deepStrictEqual(out.apiRoutes, ["/api/tasks"]);
  });

  it("designer accepts palette and tailwind config", () => {
    const out = validateDesignerOutput(
      JSON.stringify({ tailwindConfig: { theme: { extend: {} } }, colorPalette: { primary: "#FF6A00", background: "#0A0A0A", foreground: "#FFFFFF", accent: "#FFB347" }, layoutSpec: { grid: "12" } }),
    );
    assert.strictEqual(out.colorPalette.primary, "#FF6A00");
  });

  it("frontend accepts file array and filters invalid extensions", () => {
    const out = validateFrontendOutput(
      JSON.stringify({ files: [{ path: "src/routes/index.tsx", content: "export default function() {}" }, { path: "src/styles/app.css", content: "body{}" }, { path: "README.md", content: "# X" }] }),
    );
    assert.ok(out.some((f) => f.path === "src/routes/index.tsx"));
    assert.ok(out.some((f) => f.path === "src/styles/app.css"));
    assert.ok(out.some((f) => f.path === "README.md"));
  });

  it("backend accepts .ts and .sql files only", () => {
    const out = validateBackendOutput(
      JSON.stringify({ files: [{ path: "src/lib/tasks.server.ts", content: "export const x = 1;" }, { path: "supabase.sql", content: "SELECT 1;" }] }),
    );
    assert.strictEqual(out.length, 2);
  });

  it("deployment accepts vercel/dockerfile/readme/envExample", () => {
    const out = validateDeploymentOutput(
      JSON.stringify({ vercelConfig: "{}", dockerfile: "FROM node:20", readme: "# X", envExample: "A=1" }),
    );
    assert.strictEqual(out.length, 4);
    assert.ok(out.some((f) => f.path === "vercel.json"));
    assert.ok(out.some((f) => f.path === "Dockerfile"));
  });
});
