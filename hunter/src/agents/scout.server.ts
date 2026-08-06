import { env } from "../lib/env";

export type LeadInput = {
  orgName: string;
  orgDomain: string;
  website?: string;
  industry?: string;
  country?: string;
  sizeRange?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  sourceChannel: string;
  sourceUrl: string;
  sourceRaw?: Record<string, unknown>;
};

type Adapter = (config: Record<string, unknown>) => Promise<LeadInput[]>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "user-agent": "SignhifyHunter/1.0 (public data feeds only)", ...headers },
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 429) throw new Error(`rate limited (429): ${url}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

const hnalgolia: Adapter = async (config) => {
  const queries = (config.queries ?? [
    '"need a developer" build',
    '"looking for an agency" AI',
    '"need help building" MVP app',
    '"hire" "web developer" startup',
  ]) as string[];
  const out: LeadInput[] = [];
  for (const q of queries.slice(0, 4)) {
    const data = (await fetchJson(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=20`,
    )) as { hits: Array<{ objectID: string; title: string; url?: string; points?: number; created_at: string }> };
    for (const hit of data.hits ?? []) {
      if ((hit.points ?? 0) < 2) continue;
      const url = hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`;
      let domain = "";
      try {
        domain = new URL(url).hostname.replace(/^www\./, "");
      } catch {
        continue;
      }
      out.push({
        orgName: domain || hit.title.slice(0, 40),
        orgDomain: domain || `hn-${hit.objectID}`,
        website: url,
        country: undefined,
        sourceChannel: "hackernews",
        sourceUrl: url,
        sourceRaw: { title: hit.title, points: hit.points, hnId: hit.objectID },
      });
    }
    await sleep(1200);
  }
  return out;
};

const github: Adapter = async (config) => {
  if (!env.githubToken) throw new Error("HUNTER_GITHUB_TOKEN not set — adapter disabled");
  const q = String(config.query ?? `"need help building" OR "hire a developer" in:readme pushed:>${daysAgo(30)}`);
  const data = (await fetchJson(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=20`,
    { authorization: `Bearer ${env.githubToken}`, accept: "application/vnd.github+json" },
  )) as { items: Array<{ full_name: string; html_url: string; description?: string; homepage?: string }> };
  return (data.items ?? []).map((r) => ({
    orgName: r.full_name.split("/")[0] ?? r.full_name,
    orgDomain: (r.homepage ? stripDomain(r.homepage) : `${r.full_name.split("/")[0]?.toLowerCase()}.github.io`) ?? r.full_name,
    website: r.homepage ?? r.html_url,
    industry: "software",
    sourceChannel: "github",
    sourceUrl: r.html_url,
    sourceRaw: { repo: r.full_name, description: r.description },
  }));
};

const reddit: Adapter = async (config) => {
  const subs = (config.subreddits ?? ["forhire", "SaaS", "startups"]) as string[];
  const terms = (config.terms ?? ["need a developer", "looking for an agency", "help building app"]) as string[];
  const out: LeadInput[] = [];
  for (const sub of subs.slice(0, 3)) {
    for (const term of terms.slice(0, 2)) {
      const data = (await fetchJson(
        `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(term)}&restrict_sr=1&sort=new&limit=15`,
      )) as { data?: { children: Array<{ data: { id: string; title: string; url: string; selftext?: string; author?: string } }> } };
      for (const c of data.data?.children ?? []) {
        const d = c.data;
        const permalink = `https://www.reddit.com${d.url}`;
        out.push({
          orgName: `reddit-${d.author ?? d.id}`,
          orgDomain: `reddit-${d.id}`,
          website: permalink,
          country: undefined,
          sourceChannel: "reddit",
          sourceUrl: permalink,
          sourceRaw: { sub, title: d.title, excerpt: (d.selftext ?? "").slice(0, 300), author: d.author },
        });
      }
      await sleep(2500);
    }
    await sleep(2500);
  }
  return out;
};

const producthunt: Adapter = async (config) => {
  if (!env.producthuntToken) throw new Error("HUNTER_PRODUCTHUNT_TOKEN not set — adapter disabled");
  const query = `{
    posts(order: NEWEST, first: 30) {
      edges { node { name tagline url website discussions { edges { node { url } } } } }
    }
  }`;
  const body = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: { authorization: `Bearer ${env.producthuntToken}`, "content-type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((r) => r.json() as Promise<{ data?: { posts?: { edges: Array<{ node: { name: string; tagline?: string; website?: string; url: string } }> } } }>);
  return (body.data?.posts?.edges ?? []).map(({ node }) => ({
    orgName: node.name,
    orgDomain: node.website ? stripDomain(node.website) : `ph-${node.name}`,
    website: node.website ?? node.url,
    industry: "saas",
    sourceChannel: "producthunt",
    sourceUrl: node.url,
    sourceRaw: { tagline: node.tagline },
  }));
};

const adapters: Record<string, Adapter> = { hnalgolia, github, reddit, producthunt };
export const adapterChannels = Object.keys(adapters);

export function stripDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

export async function scoutSource(channel: string, config: Record<string, unknown>): Promise<LeadInput[]> {
  const adapter = adapters[channel];
  if (!adapter) throw new Error(`unknown channel: ${channel}`);
  return adapter(config);
}
