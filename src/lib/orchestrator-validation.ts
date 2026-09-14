export function assertJsonObject(text: string): unknown {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Expected JSON object");
  }
  return parsed;
}

export function validateStrategistOutput(text: string): {
  productName: string;
  oneLiner: string;
  targetAudience: string;
  keyFeatures: string[];
} {
  const obj = assertJsonObject(text) as any;
  if (typeof obj.productName !== "string" || typeof obj.oneLiner !== "string") {
    throw new Error("Missing productName or oneLiner");
  }
  if (!Array.isArray(obj.keyFeatures) || obj.keyFeatures.length < 3) {
    throw new Error("keyFeatures must be array with >= 3 items");
  }
  return {
    productName: obj.productName,
    oneLiner: obj.oneLiner,
    targetAudience: typeof obj.targetAudience === "string" ? obj.targetAudience : "",
    keyFeatures: obj.keyFeatures.slice(0, 8),
  };
}

export function validateArchitectOutput(text: string): {
  supabaseMigration: string;
  typescriptTypes: string;
  apiRoutes: string[];
} {
  const obj = assertJsonObject(text) as any;
  if (
    typeof obj.supabaseMigration !== "string" ||
    !obj.supabaseMigration.includes("CREATE TABLE")
  ) {
    throw new Error("Missing valid supabaseMigration");
  }
  if (typeof obj.typescriptTypes !== "string" || !obj.typescriptTypes.includes("export")) {
    throw new Error("Missing valid typescriptTypes");
  }
  return {
    supabaseMigration: obj.supabaseMigration,
    typescriptTypes: obj.typescriptTypes,
    apiRoutes: Array.isArray(obj.apiRoutes) ? obj.apiRoutes.slice(0, 6) : [],
  };
}

export function validateDesignerOutput(text: string): {
  tailwindConfig: Record<string, unknown>;
  colorPalette: { primary: string; background: string; foreground: string; accent: string };
  layoutSpec: Record<string, unknown>;
} {
  const obj = assertJsonObject(text) as any;
  if (typeof obj.tailwindConfig !== "object" || obj.tailwindConfig === null)
    throw new Error("Missing tailwindConfig");
  if (typeof obj.colorPalette?.primary !== "string")
    throw new Error("Missing colorPalette.primary");
  return {
    tailwindConfig: obj.tailwindConfig,
    colorPalette: obj.colorPalette,
    layoutSpec: typeof obj.layoutSpec === "object" ? obj.layoutSpec : {},
  };
}

export function validateFrontendOutput(
  text: string,
): { path: string; content: string; language?: string }[] {
  const obj = assertJsonObject(text) as any;
  if (!Array.isArray(obj.files) || obj.files.length === 0) throw new Error("files array required");
  const out: { path: string; content: string; language?: string }[] = [];
  for (const f of obj.files) {
    const path =
      typeof f.path === "string" ? f.path.replace(/^\/+/, "").replace(/\.\.\//g, "") : "";
    const content = typeof f.content === "string" ? f.content : "";
    if (!path || !content) continue;
    if (!/\.(tsx?|jsx?|css|json|md)$/.test(path) && !path.endsWith(".ts") && !path.endsWith(".js"))
      continue;
    out.push({ path, content, language: path.split(".").pop() });
  }
  if (out.length === 0) throw new Error("No valid files produced");
  return out;
}

export function validateBackendOutput(
  text: string,
): { path: string; content: string; language?: string }[] {
  const obj = assertJsonObject(text) as any;
  if (!Array.isArray(obj.files) || obj.files.length === 0) throw new Error("files array required");
  const out: { path: string; content: string; language?: string }[] = [];
  for (const f of obj.files) {
    const path =
      typeof f.path === "string" ? f.path.replace(/^\/+/, "").replace(/\.\.\//g, "") : "";
    const content = typeof f.content === "string" ? f.content : "";
    if (!path || !content) continue;
    if (!/\.(ts|js|json|sql|md)$/.test(path)) continue;
    out.push({ path, content, language: path.split(".").pop() });
  }
  if (out.length === 0) throw new Error("No valid files produced");
  return out;
}

export function validateDeploymentOutput(
  text: string,
): { path: string; content: string; language?: string }[] {
  const obj = assertJsonObject(text) as any;
  const out: { path: string; content: string; language?: string }[] = [];
  const add = (path: string, content: string) => {
    const p = path.replace(/^\/+/, "").replace(/\.\.\//g, "");
    if (p && content) out.push({ path: p, content, language: p.split(".").pop() });
  };
  if (typeof obj.vercelConfig === "string") add("vercel.json", obj.vercelConfig);
  if (typeof obj.dockerfile === "string") add("Dockerfile", obj.dockerfile);
  if (typeof obj.readme === "string") add("README.md", obj.readme);
  if (typeof obj.envExample === "string") add(".env.example", obj.envExample);
  if (out.length === 0) throw new Error("No deployment artifacts produced");
  return out;
}
