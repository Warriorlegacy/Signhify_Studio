import { Json } from "@/integrations/supabase/types";

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

type ProviderConfig = {
  name: string;
  url: string;
  model: string;
  apiKey?: string;
  headers?: Record<string, string>;
};

export async function generateAIResponse(options: AIGatewayOptions): Promise<string> {
  // Define our fallback cascade of top-tier free/accessible models
  const providers: ProviderConfig[] = [
    // 1. Groq (Best Free - Extremely fast Llama 3)
    {
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.3-70b-versatile",
      apiKey: process.env.GROQ_API_KEY,
    },
    // 2. Cerebras (Ultra-fast fallback)
    {
      name: "Cerebras",
      url: "https://api.cerebras.ai/v1/chat/completions",
      model: "llama3.1-70b",
      apiKey: process.env.CEREBRAS_API_KEY,
    },
    // 3. Google Gemini (Reliable free tier)
    {
      name: "Gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY,
    },
    // 4. Mistral (Fallback)
    {
      name: "Mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      model: "mistral-small-latest",
      apiKey: process.env.MISTRAL_API_KEY,
    },
    // 5. xAI (Grok)
    {
      name: "xAI",
      url: "https://api.x.ai/v1/chat/completions",
      model: "grok-beta",
      apiKey: process.env.XAI_API_KEY,
    },
    // 6. OpenRouter (Primary - very flexible)
    {
      name: "OpenRouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      apiKey: process.env.OPENROUTER_API_KEY,
    }
  ];

  const activeProviders = providers.filter(p => !!p.apiKey);

  if (activeProviders.length === 0) {
    throw new Error("No AI API keys configured. Please add GROQ_API_KEY, CEREBRAS_API_KEY, or others to .env.");
  }

  let lastError: any = null;

  for (const provider of activeProviders) {
    try {
      console.log(`[AI Gateway] Attempting generation with ${provider.name} (${provider.model})...`);
      
      const res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
          ...provider.headers,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          response_format: options.response_format,
          max_tokens: options.max_tokens,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text().catch(() => "Unknown error");
        console.warn(`[AI Gateway] ${provider.name} failed (${res.status}): ${errorData}`);
        
        // If rate limited or server error, continue to next provider
        if (res.status === 429 || res.status >= 500) {
          lastError = new Error(`${provider.name} returned ${res.status}`);
          continue;
        }
        
        throw new Error(`${provider.name} error: ${errorData}`);
      }

      const json = await res.json();
      let content = json.choices?.[0]?.message?.content;
      
      if (!content) {
        console.warn(`[AI Gateway] ${provider.name} returned empty content.`);
        continue;
      }

      // Final cleanup of markdown fences if any provider ignored jsonMode
      if (content.startsWith("```json")) {
        content = content.replace(/^```json/m, "").replace(/```$/m, "").trim();
      } else if (content.startsWith("```")) {
        content = content.replace(/^```/m, "").replace(/```$/m, "").trim();
      }

      return content;
    } catch (e) {
      console.warn(`[AI Gateway] Exception with ${provider.name}:`, e);
      lastError = e;
      continue;
    }
  }

  throw lastError || new Error("All AI providers failed.");
}
