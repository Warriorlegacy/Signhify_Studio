export async function deployToCloudflare({
  projectSlug,
  artifactUrls,
}: {
  projectSlug: string;
  artifactUrls: string[];
  userId: string;
}) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !accountId) throw new Error("Missing Cloudflare credentials.");
  const projectName = `signhify-${projectSlug}`;
  const headers = { Authorization: `Bearer ${token}`, "content-type": "application/json" };
  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: projectName, production_branch: "main" }),
  }).catch(() => null);
  const files = await Promise.all(
    artifactUrls.map(async (url, i) => ({
      name: `artifact-${i + 1}.txt`,
      content: await fetch(url)
        .then((r) => r.text())
        .catch(() => ""),
    })),
  );
  // TODO(cloudflare): Cloudflare Pages direct upload requires multipart manifest + hashes; this sends a deployment intent payload until artifacts are normalized.
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    { method: "POST", headers, body: JSON.stringify({ files }) },
  );
  if (!res.ok) console.warn("[cloudflare] deployment API returned", res.status);
  return { deploymentUrl: `https://${projectSlug}.signhify.app` };
}
