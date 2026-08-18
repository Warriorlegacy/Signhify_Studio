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
  const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`;
  const headers = { Authorization: `Bearer ${token}` };

  // Ensure the Pages project exists (Direct Upload projects must exist before deploying)
  const existing = await fetch(`${base}/${projectName}`, { headers })
    .then((r) => r.json())
    .catch(() => null);
  if (!existing?.result) {
    const created = await fetch(base, {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify({ name: projectName, production_branch: "main" }),
    });
    if (!created.ok && created.status !== 409) {
      throw new Error(`Failed to create Pages project: ${await created.text()}`);
    }
  }

  // Resolve file contents to deploy
  let fileContents: Array<{ name: string; content: string }>;
  if (files && files.length > 0) {
    fileContents = files;
  } else if (artifactUrls && artifactUrls.length > 0) {
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

  // Direct Upload: multipart form-data, one field per file path, plus optional metadata.json
  const form = new FormData();
  fileContents.forEach((file) => {
    form.append(file.name, new Blob([file.content], { type: "text/plain" }));
  });
  form.append(
    "metadata.json",
    new Blob([JSON.stringify({ user_id: userId, created_by: "signhify" })], {
      type: "application/json",
    }),
  );

  const res = await fetch(`${base}/${projectName}/deployments`, {
    method: "POST",
    headers,
    body: form,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.result?.url) {
    throw new Error(`Deployment failed (${res.status}): ${JSON.stringify(json)}`);
  }

  return { deploymentUrl: json.result.url };
}
