import { generateAIResponseWithMetadata, type AIGatewayOptions } from "./ai-gateway.server";

/**
 * Legacy shim used by admin-only surfaces (e.g. build-product). Admin paths
 * always use managed Signhify AI, so no BYOK routing is applied here.
 * User-facing AI endpoints must use `generateAIResponseFor` instead.
 */
export async function generateAIResponseWithMetadataAndUsage(
  options: AIGatewayOptions,
  _userId?: string | null,
  _supabase?: unknown,
): Promise<{ content: string; providerUsed: string; tokensUsed: number }> {
  const { content, providerUsed } = await generateAIResponseWithMetadata(options);
  return { content, providerUsed, tokensUsed: 0 };
}
