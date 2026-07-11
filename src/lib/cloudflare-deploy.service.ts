// Full deployment service
export interface CloudflareDeployConfig {
  projectSlug: string;
  artifactUrls: string[];
  userId: string;
  envVars?: Record<string, string>;
  customDomain?: string;
}

export interface DeploymentResult {
  deploymentUrl: string;
  deploymentId: string;
  status: "pending" | "success" | "failed";
  logs: string[];
}
