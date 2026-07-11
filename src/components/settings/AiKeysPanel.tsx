import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  listMyAiKeys,
  saveMyAiKey,
  deleteMyAiKey,
} from "@/lib/user-ai-keys.functions";

// Keep names in sync with BYOK_PROVIDERS in ai-access.server.ts.
const PROVIDER_META: Record<string, { label: string; hint: string; docs: string }> = {
  Groq: { label: "Groq", hint: "Fast Llama 3.3 70B", docs: "https://console.groq.com/keys" },
  Cerebras: { label: "Cerebras", hint: "Llama 3.3 70B", docs: "https://cloud.cerebras.ai/" },
  NVIDIA: { label: "NVIDIA NIM", hint: "Nemotron 49B", docs: "https://build.nvidia.com/" },
  OpenRouter: { label: "OpenRouter", hint: "Any model via one key", docs: "https://openrouter.ai/keys" },
  Gemini: { label: "Google Gemini", hint: "gemini-2.0-flash", docs: "https://aistudio.google.com/app/apikey" },
  Ollama: { label: "Ollama Turbo", hint: "gpt-oss 120B hosted", docs: "https://ollama.com/settings/keys" },
  Mistral: { label: "Mistral", hint: "mistral-small-latest", docs: "https://console.mistral.ai/api-keys" },
  Cohere: { label: "Cohere", hint: "command-r-plus", docs: "https://dashboard.cohere.com/api-keys" },
  xAI: { label: "xAI Grok", hint: "grok-2-latest", docs: "https://console.x.ai/" },
  Anthropic: { label: "Anthropic Claude", hint: "claude-3.5-sonnet", docs: "https://console.anthropic.com/settings/keys" },
};

type Row = { provider: string; configured: boolean; updatedAt: string | null };

export default function AiKeysPanel() {
  const list = useServerFn(listMyAiKeys);
  const save = useServerFn(saveMyAiKey);
  const remove = useServerFn(deleteMyAiKey);
  const [rows, setRows] = useState<Row[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    try {
      const r = await list({ data: undefined } as never);
      setRows(r.providers);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSave(provider: string) {
    const apiKey = inputs[provider]?.trim() ?? "";
    if (!apiKey) return;
    setBusy(provider);
    try {
      await save({ data: { provider, apiKey } } as never);
      setInputs((s) => ({ ...s, [provider]: "" }));
      toast.success(`${PROVIDER_META[provider]?.label ?? provider} key saved`);
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function onDelete(provider: string) {
    setBusy(provider);
    try {
      await remove({ data: { provider } } as never);
      toast.success(`${PROVIDER_META[provider]?.label ?? provider} key removed`);
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Bring your own AI keys</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Free plan uses your own provider keys. Paid plans (Studio, Scale) use
          managed Signhify AI automatically. Keys are stored only for your
          account and never shown back in full.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const meta = PROVIDER_META[r.provider] ?? {
              label: r.provider,
              hint: "",
              docs: "#",
            };
            return (
              <li
                key={r.provider}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{meta.label}</div>
                    <div className="text-xs text-muted-foreground">{meta.hint}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {r.configured ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-400">
                        Configured
                      </span>
                    ) : (
                      <a
                        href={meta.docs}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-primary underline"
                      >
                        Get key
                      </a>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder={r.configured ? "Replace key…" : "Paste API key"}
                    value={inputs[r.provider] ?? ""}
                    onChange={(e) =>
                      setInputs((s) => ({ ...s, [r.provider]: e.target.value }))
                    }
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={busy === r.provider || !(inputs[r.provider]?.trim())}
                      onClick={() => onSave(r.provider)}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      Save
                    </button>
                    {r.configured && (
                      <button
                        disabled={busy === r.provider}
                        onClick={() => onDelete(r.provider)}
                        className="rounded-md border border-border bg-surface px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
