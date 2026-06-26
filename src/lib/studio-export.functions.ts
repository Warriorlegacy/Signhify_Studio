import { createServerFn } from "@tanstack/react-start";

/**
 * Export a Scroll Studio project as a downloadable ZIP.
 * Stub implementation — wire to real packaging logic when available.
 */
export const exportScrollStudioProject = createServerFn({ method: "POST" })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    return {
      success: false as const,
      projectId: data.projectId,
      error: "Export is not yet implemented",
    };
  });

/**
 * Deploy a Scroll Studio project to its hosting target.
 * Stub implementation — wire to real deploy pipeline when available.
 */
export const deployScrollStudioProject = createServerFn({ method: "POST" })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    return {
      success: false as const,
      projectId: data.projectId,
      deploymentUrl: null,
      error: "Deploy is not yet implemented",
    };
  });
