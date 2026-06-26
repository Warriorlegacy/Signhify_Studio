/**
 * Stub module for Scroll Studio export/deploy.
 * Replace with real createServerFn implementations when packaging/deploy pipeline lands.
 * Shape matches what `src/routes/studio.spike.tsx` consumes.
 */

type ExportResult = {
  data?: {
    success: boolean;
    downloadUrl: string;
    fileName: string;
  };
};

type DeployResult = {
  data?: {
    success: boolean;
    deploymentUrl: string;
  };
};

export const exportScrollStudioProject = {
  call(_args: { projectId: string }, _opts?: unknown): Promise<ExportResult> {
    return Promise.resolve({
      data: undefined,
    });
  },
};

export const deployScrollStudioProject = {
  call(_args: { projectId: string }, _opts?: unknown): Promise<DeployResult> {
    return Promise.resolve({
      data: undefined,
    });
  },
};
