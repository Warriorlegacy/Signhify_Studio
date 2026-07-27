import https from "node:https";
import fs from "node:fs";
import path from "node:path";

const DOMAIN = "signhify.dpdns.org";
const KEY = "f6d8a7c29e134b2895e63810a4c27bdf";
const KEY_LOCATION = `https://${DOMAIN}/${KEY}.txt`;

const staticPaths = [
  "/",
  "/projects",
  "/services",
  "/ai",
  "/marketplace",
  "/marketplace/sell",
  "/pricing",
  "/templates",
  "/vision",
  "/roadmap",
  "/about",
  "/contact",
  "/book",
  "/sprint",
  "/insights",
  "/brand",
  "/help",
  "/privacy",
  "/terms",
];

// Extract project slugs from src/lib/projects.ts
const projectsTsContent = fs.readFileSync(
  path.resolve("src/lib/projects.ts"),
  "utf-8"
);
const slugMatches = [...projectsTsContent.matchAll(/slug:\s*["']([^"']+)["']/g)];
const projectSlugs = slugMatches.map((m) => m[1]);
const projectPaths = projectSlugs.map((slug) => `/projects/${slug}`);

const allPaths = Array.from(new Set([...staticPaths, ...projectPaths]));
const URLS = allPaths.map((p) => `https://${DOMAIN}${p}`);

const payload = JSON.stringify({
  host: DOMAIN,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
});

console.log(`🚀 Dispatching ${URLS.length} URLs to IndexNow for instant search engine indexing...`);

const endpoints = [
  "api.indexnow.org",
  "www.bing.com",
  "search.seznam.cz",
  "yandex.com",
];

endpoints.forEach((host) => {
  const req = https.request(
    {
      hostname: host,
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      },
    },
    (res) => {
      console.log(`[IndexNow Batch] ${host} -> Status: ${res.statusCode} (Dispatched ${URLS.length} URLs)`);
    }
  );

  req.on("error", (err) => {
    console.error(`[IndexNow Error] ${host} -> ${err.message}`);
  });

  req.write(payload);
  req.end();
});
