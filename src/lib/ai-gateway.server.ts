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
  return robustGenerateAIResponse(options);
}

// Export the robust AI service for advanced usage
export { robustAIService } from "./robust-ai-service";
