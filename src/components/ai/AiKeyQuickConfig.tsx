import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Key, Check, Loader2, ExternalLink, X } from "lucide-react";
import {
  listMyAiKeys,
  saveMyAiKey,
  deleteMyAiKey,
} from "@/lib/user-ai-keys.functions";
import { BYOK_PROVIDERS } from "@/lib/ai-access.server";

const PROVIDER_META: Record<string, { label: string; docs: string }> = {
  OpenAI: { label: "OpenAI", docs: "https://platform.openai.com/api-keys" },
  Groq: { label: "Groq", docs: "https://console.groq.com/keys" },
  Cerebras: { label: "Cerebras", docs: "https://cloud.cerebras.ai/" },
  NVIDIA: { label: "NVIDIA NIM", docs: "https://build.nvidia.com/" },
  OpenRouter: { label: "OpenRouter", docs: "https://openrouter.ai/keys" },
  Gemini: { label: "Google Gemini", docs: "https://aistudio.google.com/app/apikey" },
  Ollama: { label: "Ollama Turbo", docs: "https://ollama.com/settings/keys" },
  Mistral: { label: "Mistral", docs: "https://console.mistral.ai/api-keys" },
  Cohere: { label: "Cohere", docs: "https://dashboard.cohere.com/api-keys" },
  xAI: { label: "xAI Grok", docs: "https://console.x.ai/" },
  Anthropic: { label: "Anthropic Claude", docs: "https://console.anthropic.com/settings/keys" },
  Custom: { label: "Custom Endpoint", docs: "" },
};

export default function AiKeyQuickConfig() {
  const list = useServerFn(listMyAiKeys);
  const save = useServerFn(saveMyAiKey);
  const remove = useServerFn(deleteMyAiKey);

  const [configured, setConfigured] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    try {
      const r = await list({ data: undefined } as never);
      setConfigured(r.providers.filter((p: { configured: boolean }) => p.configured).map((p: { provider: string }) => p.provider));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function handleSave() {
    if (!selected || !apiKey.trim()) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = { provider: selected, apiKey: apiKey.trim() };
      if (selected === "Custom" && customEndpoint.trim()) {
        payload.apiEndpoint = customEndpoint.trim();
      }
      await save({ data: payload } as never);
      setApiKey("");
      setCustomEndpoint("");
      setSelected("");
      toast.success("AI key saved");
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(provider: string) {
    try {
      await remove({ data: { provider } } as never);
      toast.success("Key removed");
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-5">
      <div className="flex items-center gap-2 text-sm font-semibold mb-3">
        <Key size={14} /> Configure your AI key
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          {configured.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {configured.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">
                  <Check size={10} />
                  {PROVIDER_META[p]?.label ?? p}
                  <button onClick={() => handleRemove(p)} className="hover:text-red-400 ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {!selected ? (
            <div className="flex flex-wrap gap-1.5">
              {BYOK_PROVIDERS.map((p) => {
                const meta = PROVIDER_META[p];
                const isConfigured = configured.includes(p);
                return (
                  <button
                    key={p}
                    disabled={isConfigured}
                    onClick={() => setSelected(p)}
                    className="text-xs rounded-full border border-border bg-surface/60 px-3 py-1.5 hover:border-primary/60 transition disabled:opacity-40"
                  >
                    {meta?.label ?? p}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{PROVIDER_META[selected]?.label ?? selected}</span>
                {selected !== "Custom" && (
                  <a
                    href={PROVIDER_META[selected]?.docs}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-primary underline inline-flex items-center gap-1"
                  >
                    Get key <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="password"
                autoComplete="off"
                placeholder="Paste API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              {selected === "Custom" && (
                <input
                  type="url"
                  autoComplete="off"
                  placeholder="https://my-model.example.com/v1"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !apiKey.trim()}
                  className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : "Save key"}
                </button>
                <button
                  onClick={() => { setSelected(""); setApiKey(""); setCustomEndpoint(""); }}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
