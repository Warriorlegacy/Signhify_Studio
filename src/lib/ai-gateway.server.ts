import { Json } from "../integrations/supabase/types";
import { generateAIResponse as robustGenerateAIResponse } from "./robust-ai-service";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIGatewayOptions = {
  messages: Message[];
  temperature?: number;
  response_format?: { type: "json_object" };
  max_tokens?: number;
};

// Maintain backward compatibility by using the robust AI service
export async function generateAIResponse(options: AIGatewayOptions): Promise<string> {
  const result = await robustGenerateAIResponse(options);
  return result.content;
}

// Export the robust AI service for advanced usage (returns content and provider used)
export async function generateAIResponseWithMetadata(
  options: AIGatewayOptions,
): Promise<{ content: string; providerUsed: string }> {
  return robustGenerateAIResponse(options);
}

export { robustAIService } from "./robust-ai-service";
