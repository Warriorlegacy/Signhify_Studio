export async function deployToCloudflare({
  projectSlug,
  artifactUrls,
  userId,
  files,
}: {
  projectSlug: string;
  artifactUrls?: string[];
  userId: string;
  files?: Array<{ name: string; content: string }>;
}) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !accountId) throw new Error("Missing Cloudflare credentials.");
  const projectName = `signhify-${projectSlug}`;
  const headers = { Authorization: `Bearer ${token}`, "content-type": "application/json" };

  // Ensure project exists
  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: projectName, production_branch: "main" }),
  }).catch(() => null);

  // Determine file contents to deploy
  let fileContents: Array<{ name: string; content: string }> = [];
  if (files && files.length > 0) {
    // Use provided file contents directly
    fileContents = files;
  } else if (artifactUrls && artifactUrls.length > 0) {
    // Fetch file contents from URLs
    fileContents = await Promise.all(
      artifactUrls.map(async (url, i) => ({
        name: `artifact-${i + 1}.txt`,
        content: await fetch(url)
          .then((r) => r.text())
          .catch(() => ""),
      })),
    );
  } else {
    throw new Error("Either artifactUrls or files must be provided");
  }

  // Deploy to Cloudflare Pages
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    { method: "POST", headers, body: JSON.stringify({ files: fileContents }) },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.warn("[cloudflare] deployment API returned", res.status, errorText);
  }

  return { deploymentUrl: `https://${projectSlug}.signhify.app` };
}
