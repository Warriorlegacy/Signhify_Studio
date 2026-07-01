import {
  generateAIResponseWithMetadata,
  type AIGatewayOptions,
} from "./ai-gateway.server";

/**
 * Wrapper around the robust AI service that also surfaces a token-usage
 * placeholder. The underlying provider doesn't always return usage stats,
 * so `tokensUsed` is best-effort (0 when unknown).
 */
export async function generateAIResponseWithMetadataAndUsage(
  options: AIGatewayOptions,
  _userId?: string | null,
  _supabase?: unknown,
): Promise<{ content: string; providerUsed: string; tokensUsed: number }> {
  const { content, providerUsed } = await generateAIResponseWithMetadata(options);
  return { content, providerUsed, tokensUsed: 0 };
}
