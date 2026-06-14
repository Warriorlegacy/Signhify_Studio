import { Json } from "../integrations/supabase/types";

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
  isAnthropic?: boolean;
  priority: number; // Lower number = higher priority
  enabled: boolean;
  failureCount: number;
  lastFailureTime: number | null;
  cooldownPeriod: number; // milliseconds to wait before retrying after failure
};

class RobustAIService {
  private providers: ProviderConfig[] = [];
  private readonly maxFailuresBeforeCooldown = 3;
  private readonly defaultCooldownPeriod = 5 * 60 * 1000; // 5 minutes
  private readonly healthCheckInterval = 30 * 60 * 1000; // 30 minutes
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeProviders();
    this.startHealthCheckTimer();
  }

  private initializeProviders() {
    const env = (k: string) => process.env[k] || undefined;

    // Define all available providers with their priorities
    const allProviders: ProviderConfig[] = [
      // 0. Lovable AI Gateway (auto-provisioned, billed via workspace credits) — most reliable
      {
        name: "LovableAI",
        url: "https://ai.gateway.lovable.dev/v1/chat/completions",
        model: "google/gemini-3-flash-preview",
        apiKey: env("LOVABLE_API_KEY"),
        headers: { "Lovable-API-Key": env("LOVABLE_API_KEY") ?? "" },
        isAnthropic: false,
        priority: 1, // Highest priority
        enabled: !!env("LOVABLE_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 1. Groq — fastest free Llama 3.3 70B
      {
        name: "Groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: "llama-3.3-70b-versatile",
        apiKey: env("GROQ_API_KEY"),
        isAnthropic: false,
        priority: 2,
        enabled: !!env("GROQ_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 2. Cerebras — wafer-scale Llama 3.3 70B
      {
        name: "Cerebras",
        url: "https://api.cerebras.ai/v1/chat/completions",
        model: "llama-3.3-70b",
        apiKey: env("CEREBRAS_API_KEY"),
        isAnthropic: false,
        priority: 3,
        enabled: !!env("CEREBRAS_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 3. NVIDIA NIM — free hosted Nemotron 49B
      {
        name: "NVIDIA",
        url: "https://integrate.api.nvidia.com/v1/chat/completions",
        model: "nvidia/llama-3.3-nemotron-super-49b-v1",
        apiKey: env("NVIDIA_API_KEY"),
        isAnthropic: false,
        priority: 4,
        enabled: !!env("NVIDIA_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 4. OpenRouter — best free model (DeepSeek V3.1)
      {
        name: "OpenRouter",
        url: "https://openrouter.ai/api/v1/chat/completions",
        model: "deepseek/deepseek-chat-v3.1:free",
        apiKey: env("OPENROUTER_API_KEY"),
        headers: {
          "HTTP-Referer": "https://signhify.lovable.app",
          "X-Title": "Signhify",
        },
        isAnthropic: false,
        priority: 5,
        enabled: !!env("OPENROUTER_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 5. Google Gemini — generous free tier
      {
        name: "Gemini",
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        model: "gemini-2.0-flash",
        apiKey: env("GEMINI_API_KEY"),
        isAnthropic: false,
        priority: 6,
        enabled: !!env("GEMINI_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 6. Ollama Turbo — gpt-oss 120B hosted
      {
        name: "Ollama",
        url: "https://ollama.com/v1/chat/completions",
        model: "gpt-oss:120b",
        apiKey: env("OLLAMA_API_KEY"),
        isAnthropic: false,
        priority: 7,
        enabled: !!env("OLLAMA_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 7. Mistral — free tier small
      {
        name: "Mistral",
        url: "https://api.mistral.ai/v1/chat/completions",
        model: "mistral-small-latest",
        apiKey: env("MISTRAL_API_KEY"),
        isAnthropic: false,
        priority: 8,
        enabled: !!env("MISTRAL_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 8. Cohere — Command R+ via OpenAI-compatible endpoint
      {
        name: "Cohere",
        url: "https://api.cohere.ai/compatibility/v1/chat/completions",
        model: "command-r-plus",
        apiKey: env("COHERE_API_KEY"),
        isAnthropic: false,
        priority: 9,
        enabled: !!env("COHERE_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 9. xAI Grok — last resort
      {
        name: "xAI",
        url: "https://api.x.ai/v1/chat/completions",
        model: "grok-2-latest",
        apiKey: env("XAI_API_KEY"),
        isAnthropic: false,
        priority: 10,
        enabled: !!env("XAI_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 10. Anthropic Claude (if available)
      {
        name: "Anthropic",
        url: "https://api.anthropic.com/v1/messages",
        model: "claude-3-5-sonnet-20241022",
        apiKey: env("ANTHROPIC_API_KEY"),
        isAnthropic: true,
        priority: 11,
        enabled: !!env("ANTHROPIC_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      }
    ];

    // Filter enabled providers and sort by priority
    this.providers = allProviders
      .filter(provider => provider.enabled)
      .sort((a, b) => a.priority - b.priority);

    console.log(`[RobustAIService] Initialized ${this.providers.length} AI providers`);
    this.providers.forEach((provider, index) => {
      console.log(`[RobustAIService] Provider ${index + 1}: ${provider.name} (priority: ${provider.priority})`);
    });
  }

  private startHealthCheckTimer() {
    // Clear existing timer if any
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    // Set up periodic health checks
    this.healthCheckTimer = setInterval(() => {
      this.performHealthChecks();
    }, this.healthCheckInterval);

    // Perform initial health check
    this.performHealthChecks();
  }

  private performHealthChecks() {
    console.log('[RobustAIService] Performing health checks on AI providers');

    const now = Date.now();
    this.providers.forEach(provider => {
      // If provider is in cooldown, check if cooldown has expired
      if (!provider.enabled && provider.lastFailureTime !== null) {
        const timeSinceFailure = now - provider.lastFailureTime;
        if (timeSinceFailure > provider.cooldownPeriod) {
          console.log(`[RobustAIService] Provider ${provider.name} cooldown expired, re-enabling`);
          provider.enabled = true;
          provider.failureCount = 0;
          provider.lastFailureTime = null;
        }
      }
    });
  }

  private recordFailure(provider: ProviderConfig) {
    provider.failureCount++;
    provider.lastFailureTime = Date.now();

    // Disable provider if it has too many failures
    if (provider.failureCount >= this.maxFailuresBeforeCooldown) {
      provider.enabled = false;
      console.warn(`[RobustAIService] Provider ${provider.name} disabled after ${provider.failureCount} failures`);
    } else {
      console.warn(`[RobustAIService] Provider ${provider.name} failure ${provider.failureCount}/${this.maxFailuresBeforeCooldown}`);
    }
  }

  private recordSuccess(provider: ProviderConfig) {
    // Reset failure count on success
    if (provider.failureCount > 0) {
      console.log(`[RobustAIService] Provider ${provider.name} recovered, resetting failure count`);
      provider.failureCount = 0;
      provider.lastFailureTime = null;
    }
  }

  private buildProviderHeaders(provider: ProviderConfig): Record<string, string> {
    const headers: Record<string, string> = { "content-type": "application/json" };

    if (provider.isAnthropic) {
      headers["x-api-key"] = provider.apiKey!;
      headers["anthropic-version"] = "2023-06-01";
    } else {
      headers["Authorization"] = `Bearer ${provider.apiKey}`;
      if (provider.headers) {
        Object.assign(headers, provider.headers);
      }
    }

    return headers;
  }

  private buildRequestBody(provider: ProviderConfig, options: AIGatewayOptions): Record<string, unknown> {
    if (provider.isAnthropic) {
      return {
        model: provider.model,
        max_tokens: options.max_tokens ?? 2400,
        stream: false,
        system: options.messages.find(m => m.role === "system")?.content || "",
        messages: options.messages
          .filter(m => m.role !== "system")
          .map(m => ({ role: m.role, content: m.content }))
      };
    } else {
      return {
        model: provider.model,
        max_tokens: options.max_tokens,
        stream: false,
        messages: options.messages.map(m => ({ role: m.role, content: m.content })),
        temperature: options.temperature ?? 0.7,
        response_format: options.response_format
      };
    }
  }

  private parseResponse(provider: ProviderConfig, json: any): string {
    if (provider.isAnthropic) {
      return json.content?.[0]?.text || "";
    } else {
      return json.choices?.[0]?.message?.content || "";
    }
  }

  async generateAIResponse(options: AIGatewayOptions): Promise<string> {
    // Filter to only enabled providers
    const availableProviders = this.providers.filter(p => p.enabled);

    if (availableProviders.length === 0) {
      throw new Error("No AI providers available. All providers are either disabled or out of cooldown.");
    }

    let lastError: any = null;
    const attempts: string[] = [];

    // Try each provider in priority order
    for (const provider of availableProviders) {
      try {
        console.log(`[RobustAIService] Attempting generation with ${provider.name} (${provider.model})...`);

        const res = await fetch(provider.url, {
          method: "POST",
          headers: this.buildProviderHeaders(provider),
          body: JSON.stringify(this.buildRequestBody(provider, options)),
        });

        if (!res.ok) {
          const errorData = await res.text().catch(() => "Unknown error");
          console.warn(`[RobustAIService] ${provider.name} failed (${res.status}): ${errorData}`);

          // Record failure and continue to next provider
          this.recordFailure(provider);
          lastError = new Error(`${provider.name} returned ${res.status}: ${errorData}`);
          attempts.push(`${provider.name}:${res.status}`);

          // If rate limited or server error, continue to next provider
          if (res.status === 429 || res.status >= 500) {
            continue;
          }

          // For other errors, we might want to stop trying depending on the error
          // For now, we'll continue to try other providers
          continue;
        }

        const json = await res.json();
        let content = this.parseResponse(provider, json);

        if (!content) {
          console.warn(`[RobustAIService] ${provider.name} returned empty content.`);
          this.recordFailure(provider);
          lastError = new Error(`${provider.name} returned empty content`);
          attempts.push(`${provider.name}:empty`);
          continue;
        }

        // Success! Record it and return the content
        this.recordSuccess(provider);
        console.log(`[RobustAIService] Successfully generated response with ${provider.name}`);
        attempts.push(`${provider.name}:ok`);
        return content;
      } catch (e) {
        console.warn(`[RobustAIService] Exception with ${provider.name}:`, e);
        this.recordFailure(provider);
        lastError = e;
        attempts.push(`${provider.name}:err`);
        continue;
      }
    }

    // If we got here, all providers failed
    const errorMessage = `All AI providers failed: ${attempts.join(", ")}`;
    console.error(`[RobustAIService] ${errorMessage}`);
    throw lastError || new Error(errorMessage);
  }

  // Method to manually reset a provider (useful for admin actions)
  resetProvider(providerName: string) {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider) {
      provider.enabled = true;
      provider.failureCount = 0;
      provider.lastFailureTime = null;
      console.log(`[RobustAIService] Provider ${providerName} manually reset`);
    }
  }

  // Get provider status for monitoring
  getProviderStatus() {
    return this.providers.map(p => ({
      name: p.name,
      enabled: p.enabled,
      failureCount: p.failureCount,
      lastFailureTime: p.lastFailureTime,
      priority: p.priority
    }));
  }

  // Cleanup method
  destroy() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }
}

// Export a singleton instance
export const robustAIService = new RobustAIService();

// Export the main function for backward compatibility
export async function generateAIResponse(options: AIGatewayOptions): Promise<string> {
  return robustAIService.generateAIResponse(options);
}