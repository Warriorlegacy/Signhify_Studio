import {
  generateAIResponse as robustGenerateAIResponse,
  robustAIService,
  type AIGatewayOptions,
} from "./robust-ai-service";
import { resolveAIAccess, type AICtx } from "./ai-access.server";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type { AIGatewayOptions };

/**
 * Managed-only helper — DO NOT call from user-facing server functions.
 * Kept for admin-only tooling that must not depend on user BYOK state.
 */
export async function generateAIResponse(options: AIGatewayOptions): Promise<string> {
  const result = await robustGenerateAIResponse(options);
  return result.content;
}

export async function generateAIResponseWithMetadata(
  options: AIGatewayOptions,
): Promise<{ content: string; providerUsed: string }> {
  return robustGenerateAIResponse(options);
}

/**
 * User-scoped AI call. Enforces the free/paid gate:
 *   - admin or paid plan → managed Signhify AI (LOVABLE_API_KEY etc.)
 *   - free plan → the user's own provider keys (BYOK). Throws BYOKRequiredError
 *     when none are configured.
 * All user-facing AI server functions should route through this.
 */
export async function generateAIResponseFor(
  options: AIGatewayOptions,
  ctx: AICtx,
): Promise<{ content: string; providerUsed: string }> {
  const access = await resolveAIAccess(ctx);
  if (access.mode === "managed") {
    return robustGenerateAIResponse({
      ...options,
      tier: access.tier,
      preferredCluster: access.tier === "free_trial" ? "free_coding" : (options.preferredCluster || "auto"),
    });
  }
  return robustAIService.generateAIResponseWithKeys(
    options,
    access.userKeys,
    access.customEndpoints,
  );
}

export { robustAIService } from "./robust-ai-service";
