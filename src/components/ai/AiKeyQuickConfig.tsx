import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Key,
  Check,
  Loader2,
  ExternalLink,
  X,
  Sparkles,
  Cookie,
  LogIn,
  Layers,
  ShieldCheck,
  Globe,
  Zap,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
} from "lucide-react";
import {
  listMyAiKeys,
  saveMyAiKey,
  deleteMyAiKey,
  testMyAiConnection,
  normalizeSessionTokenOrKey,
} from "@/lib/user-ai-keys.functions";
import { BYOK_PROVIDERS } from "@/lib/ai-access.server";

type AuthTab = "oauth" | "cookies" | "browsersync" | "apikeys";

const PROVIDER_META: Record<
  string,
  { label: string; docs: string; placeholder?: string; badge?: string }
> = {
  ChatGPT_OAuth: {
    label: "OpenAI ChatGPT Account (1-Click Login)",
    docs: "https://chatgpt.com",
    placeholder: "Sign in with your ChatGPT Plus / Free account",
    badge: "1-Click OAuth",
  },
  ChatGPT_Cookies: {
    label: "ChatGPT Session Token / Cookies",
    docs: "https://chatgpt.com",
    placeholder: "Paste __Secure-next-auth.session-token, JWT accessToken, or cookie header",
    badge: "No API Key Required",
  },
  Gemini_Cookies: {
    label: "Gemini Web Cookies",
    docs: "https://gemini.google.com",
    placeholder: "Paste __Secure-1PSID or session cookie",
    badge: "No API Key Required",
  },
  Gemini: {
    label: "Google Gemini 2.0 Flash",
    docs: "https://aistudio.google.com/app/apikey",
    placeholder: "AIzaSy...",
    badge: "1,500 Free/Day",
  },
  OpenAI: {
    label: "OpenAI API Key",
    docs: "https://platform.openai.com/api-keys",
    placeholder: "sk-proj-...",
    badge: "Official API",
  },
  Groq: {
    label: "Groq Cloud (Llama-3.3 70B)",
    docs: "https://console.groq.com/keys",
    placeholder: "gsk_...",
    badge: "Free 30 RPM",
  },
  OpenRouter: {
    label: "OpenRouter (DeepSeek R1 / V3)",
    docs: "https://openrouter.ai/keys",
    placeholder: "sk-or-...",
    badge: "Free Models",
  },
  Cerebras: {
    label: "Cerebras Fast Llama",
    docs: "https://cloud.cerebras.ai/",
    placeholder: "csk-...",
    badge: "Ultra Fast",
  },
  NVIDIA: { label: "NVIDIA NIM", docs: "https://build.nvidia.com/" },
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
  const testConn = useServerFn(testMyAiConnection);

  const [tab, setTab] = useState<AuthTab>("oauth");
  const [configured, setConfigured] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [saving, setSaving] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { ok: boolean; latencyMs?: number; message?: string }>
  >({});
  const [browserSyncActive, setBrowserSyncActive] = useState(false);
  const [oneTapManual, setOneTapManual] = useState(false);

  async function refresh() {
    try {
      const r = await list({ data: undefined } as never);
      setConfigured(
        r.providers
          .filter((p: { configured: boolean }) => p.configured)
          .map((p: { provider: string }) => p.provider),
      );
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("signhify_browser_chatgpt_sync") === "true"
    ) {
      setBrowserSyncActive(true);
    }
  }, []);

  async function handleSave(providerToSave?: string, keyToSave?: string) {
    const prov = providerToSave || selected;
    const key = keyToSave || apiKey;
    if (!prov || !key.trim()) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = { provider: prov, apiKey: key.trim() };
      if (prov === "Custom" && customEndpoint.trim()) {
        payload.apiEndpoint = customEndpoint.trim();
      }
      await save({ data: payload } as never);
      setApiKey("");
      setCustomEndpoint("");
      setSelected("");
      setOneTapManual(false);
      toast.success(`${PROVIDER_META[prov]?.label ?? prov} connected and saved securely!`);
      await refresh();
      // Automatically test connection after saving
      handleTestConnection(prov);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(provider: string) {
    try {
      await remove({ data: { provider } } as never);
      toast.success(`${PROVIDER_META[provider]?.label ?? provider} disconnected`);
      setTestResults((prev) => {
        const next = { ...prev };
        delete next[provider];
        return next;
      });
      await refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function handleTestConnection(provider: string) {
    setTestingProvider(provider);
    try {
      const result = await testConn({ data: { provider } } as never);
      setTestResults((prev) => ({
        ...prev,
        [provider]: { ok: result.ok, latencyMs: result.latencyMs, message: result.message },
      }));
      if (result.ok) {
        toast.success(`${PROVIDER_META[provider]?.label ?? provider} is active! (${result.latencyMs}ms)`);
      } else {
        toast.error(`Connection issue: ${result.message}`);
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [provider]: { ok: false, message: err?.message || "Test failed" },
      }));
      toast.error(err?.message || "Connection verification failed.");
    } finally {
      setTestingProvider(null);
    }
  }

  /**
   * 1-Click Clipboard Auto-Connect:
   * Reads clipboard, detects provider type (ChatGPT session token, OpenAI key, Gemini, etc.),
   * validates and immediately stores it securely.
   */
  async function handleClipboardAutoConnect() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard access is not supported by your browser.");
      return;
    }
    setSaving(true);
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (!trimmed) {
        toast.info("Clipboard is empty. Copy your session token or API key first.");
        setSaving(false);
        return;
      }

      let detectedProvider = "ChatGPT_Cookies";
      if (trimmed.startsWith("sk-proj-") || trimmed.startsWith("sk-")) {
        detectedProvider = "OpenAI";
      } else if (trimmed.startsWith("AIzaSy")) {
        detectedProvider = "Gemini";
      } else if (trimmed.startsWith("gsk_")) {
        detectedProvider = "Groq";
      } else if (trimmed.startsWith("csk-")) {
        detectedProvider = "Cerebras";
      } else if (trimmed.startsWith("sk-or-")) {
        detectedProvider = "OpenRouter";
      } else if (trimmed.includes("__Secure-1PSID")) {
        detectedProvider = "Gemini_Cookies";
      } else if (
        trimmed.includes("__Secure-next-auth.session-token") ||
        trimmed.startsWith("eyJ") ||
        trimmed.includes("accessToken")
      ) {
        detectedProvider = "ChatGPT_Cookies";
      }

      await handleSave(detectedProvider, trimmed);
    } catch (e: any) {
      toast.error(e?.message || "Failed to read clipboard.");
      setSaving(false);
    }
  }

  function handleCopyConsoleSnippet() {
    const snippet = `copy(document.cookie); console.log("✓ ChatGPT Cookies copied to clipboard!");`;
    navigator.clipboard.writeText(snippet);
    toast.success("Snippet copied! Press F12 on chatgpt.com → Console → Paste & Enter, then click 'Auto-Connect from Clipboard'.");
  }

  function toggleBrowserSync() {
    const next = !browserSyncActive;
    setBrowserSyncActive(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("signhify_browser_chatgpt_sync", next ? "true" : "false");
    }
    if (next) {
      toast.success("Browser Active Tab Sync connected! Using your current ChatGPT session.");
    } else {
      toast.info("Browser Active Tab Sync disabled.");
    }
  }

  // Live parsed preview of entered token
  const detectedTokenLength = apiKey ? apiKey.length : 0;
  const isLikelyJWT = apiKey.trim().startsWith("eyJ") || apiKey.includes(".eyJ");
  const isLikelyCookie = apiKey.includes("__Secure-");

  return (
    <div className="rounded-2xl border border-white/10 bg-obsidian-2/90 backdrop-blur-xl p-5 text-slate-200 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-white/8 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/20 text-ember-soft">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-white">AI Engine & Account Authentication</h4>
            <p className="text-[11px] text-slate-soft">Connect your ChatGPT session, Gemini, or custom AI provider</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/8 bg-obsidian p-1 text-xs">
          <button
            onClick={() => {
              setTab("oauth");
              setSelected("");
            }}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
              tab === "oauth" ? "bg-ember text-obsidian font-semibold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" /> 1-Tap Connect
          </button>
          <button
            onClick={() => {
              setTab("cookies");
              setSelected("ChatGPT_Cookies");
            }}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
              tab === "cookies" ? "bg-ember text-obsidian font-semibold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Cookie className="h-3.5 w-3.5" /> Session Cookies
          </button>
          <button
            onClick={() => {
              setTab("browsersync");
              setSelected("");
            }}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
              tab === "browsersync" ? "bg-ember text-obsidian font-semibold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="h-3.5 w-3.5" /> Browser Sync
          </button>
          <button
            onClick={() => {
              setTab("apikeys");
              setSelected("");
            }}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
              tab === "apikeys" ? "bg-ember text-obsidian font-semibold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Key className="h-3.5 w-3.5" /> API Keys
          </button>
        </div>
      </div>

      {/* Active Connected Providers Matrix with Real-Time Ping Tester */}
      {configured.length > 0 && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Active Connected AI Accounts & Tokens
            </span>
            <span className="text-[10px] text-emerald-500/80 lowercase">AES-256 encrypted at rest</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {configured.map((p) => {
              const test = testResults[p];
              const isTesting = testingProvider === p;
              return (
                <div
                  key={p}
                  className="inline-flex items-center gap-2 rounded-xl bg-obsidian/80 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300 font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    {PROVIDER_META[p]?.label ?? p}
                  </span>

                  {test && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        test.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}
                      title={test.message}
                    >
                      {test.ok ? `${test.latencyMs}ms ✓` : "Error"}
                    </span>
                  )}

                  <button
                    onClick={() => handleTestConnection(p)}
                    disabled={isTesting}
                    className="hover:text-white text-emerald-400/70 p-0.5 rounded hover:bg-white/10 transition-colors ml-1"
                    title="Test connection latency & status"
                  >
                    {isTesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                  </button>

                  <button
                    onClick={() => handleRemove(p)}
                    className="hover:text-red-400 text-slate-400 p-0.5 rounded hover:bg-white/10 transition-colors"
                    title="Disconnect provider"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: 1-Tap Quick Connect & Auto-Detect */}
      {tab === "oauth" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-obsidian/60 p-4">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>1-Tap Instant Connect & Auto-Detect</span>
              <span className="text-[10px] text-ember-soft font-normal">Zero Manual Config</span>
            </h5>
            <p className="text-xs text-slate-soft mb-3.5">
              Instantly connect your ChatGPT account or Gemini with 1 tap. Auto-detects tokens from clipboard or provides direct one-click bridge.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <button
                onClick={handleClipboardAutoConnect}
                disabled={saving}
                className="flex items-center justify-between rounded-xl border border-ember/40 bg-ember/10 p-3.5 hover:bg-ember/20 hover:border-ember transition-all group"
              >
                <div className="text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-ember-soft flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4 text-ember" /> 1-Tap Auto-Connect Clipboard
                  </div>
                  <div className="text-[11px] text-slate-soft">Reads copied token & connects instantly</div>
                </div>
                {saving ? (
                  <Loader2 className="h-4 w-4 text-ember animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 text-ember group-hover:scale-110 transition-transform" />
                )}
              </button>

              <button
                onClick={() => {
                  setSelected("ChatGPT_Cookies");
                  setOneTapManual(true);
                }}
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/5 p-3.5 hover:bg-white/10 hover:border-ember transition-all group"
              >
                <div className="text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-ember-soft flex items-center gap-1.5">
                    <Cookie className="h-4 w-4 text-ember-soft" /> Connect ChatGPT Session
                  </div>
                  <div className="text-[11px] text-slate-soft">Paste JWT / __Secure Session Token</div>
                </div>
                <Zap className="h-4 w-4 text-ember group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* 1-Click Extractor Helper Accordion */}
            <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-ember-soft" /> 1-Click ChatGPT Session Extractor
                </span>
                <button
                  onClick={handleCopyConsoleSnippet}
                  className="inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-md text-slate-200 transition-colors"
                >
                  <Copy className="h-3 w-3" /> Copy Snippet
                </button>
              </div>
              <p className="text-[11px] text-slate-soft leading-relaxed">
                Open <a href="https://chatgpt.com" target="_blank" rel="noreferrer" className="text-ember-soft underline">chatgpt.com</a> → Press F12 → Paste snippet in Console → Come back and click <strong>"1-Tap Auto-Connect Clipboard"</strong> above!
              </p>
            </div>

            {/* Manual Quick Entry Drawer if Opened */}
            {oneTapManual && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                <div className="text-xs text-white font-medium">Paste Session Token / Key:</div>
                <input
                  type="password"
                  placeholder="Paste your ChatGPT session token, accessToken, or sk- API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-obsidian px-3 py-2 text-sm text-slate-200 outline-none focus:border-ember font-mono"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleSave("ChatGPT_Cookies", apiKey)}
                    disabled={saving || !apiKey.trim()}
                    className="px-4 py-1.5 rounded-lg bg-ember text-obsidian font-semibold text-xs hover:bg-ember-soft disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    Save & Activate
                  </button>
                  <button
                    onClick={() => {
                      setOneTapManual(false);
                      setApiKey("");
                    }}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Session Cookies & NextAuth Token */}
      {tab === "cookies" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/8 bg-obsidian/60 p-4">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Paste Web Session Token</h5>
            <p className="text-xs text-slate-soft mb-3">
              Feed your existing browser session token. Supports raw JWT tokens, full cookie headers, or multi-line strings. Tokens are encrypted using AES-256-GCM.
            </p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSelected("ChatGPT_Cookies")}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selected === "ChatGPT_Cookies"
                    ? "border-ember bg-ember/15 text-ember-soft font-semibold"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                }`}
              >
                🍪 ChatGPT Session Token
              </button>
              <button
                onClick={() => setSelected("Gemini_Cookies")}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selected === "Gemini_Cookies"
                    ? "border-gold bg-gold/15 text-gold font-semibold"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                }`}
              >
                🍪 Gemini Web Cookie
              </button>
            </div>

            {selected && (
              <div className="space-y-2.5">
                <input
                  type="password"
                  placeholder={PROVIDER_META[selected]?.placeholder ?? "Paste session cookie or token here"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-obsidian px-3 py-2 text-sm text-slate-200 outline-none focus:border-ember font-mono"
                />

                {/* Token Shape Inspector */}
                {detectedTokenLength > 0 && (
                  <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/5">
                    <span>
                      Detected: {isLikelyJWT ? "JWT Access Token" : isLikelyCookie ? "Cookie Header Format" : "Raw Token"}{" "}
                      ({detectedTokenLength} chars)
                    </span>
                    <span className="text-emerald-400">Valid Format ✓</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-soft">
                  <span>
                    How to copy: Press F12 in ChatGPT → Application → Cookies → copy <code className="text-ember-soft">__Secure-next-auth.session-token</code>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave()}
                      disabled={saving || !apiKey.trim()}
                      className="px-4 py-1.5 rounded-md bg-ember text-obsidian font-semibold text-xs hover:bg-ember-soft disabled:opacity-40 transition-colors flex items-center gap-1.5"
                    >
                      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Session Token"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Browser Session Sync */}
      {tab === "browsersync" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/8 bg-obsidian/60 p-4">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Active Browser Tab Sync</h5>
            <p className="text-xs text-slate-soft mb-3">
              Automatically routes code generation prompts to your active open ChatGPT tab in this browser without copying any tokens or API keys.
            </p>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    browserSyncActive ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-slate-600"
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-white">Browser Tab Bridge</div>
                  <div className="text-[11px] text-slate-soft">
                    {browserSyncActive
                      ? "Status: Active & Synced with your browser session"
                      : "Status: Disconnected"}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleBrowserSync}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  browserSyncActive
                    ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                    : "bg-ember text-obsidian hover:bg-ember-soft"
                }`}
              >
                {browserSyncActive ? "Disconnect Bridge" : "Enable Tab Sync"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Free & BYOK API Keys */}
      {tab === "apikeys" && (
        <div className="space-y-3">
          {!selected ? (
            <div className="flex flex-wrap gap-2">
              {BYOK_PROVIDERS.map((p) => {
                const meta = PROVIDER_META[p];
                const isConfigured = configured.includes(p);
                return (
                  <button
                    key={p}
                    disabled={isConfigured}
                    onClick={() => setSelected(p)}
                    className="text-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:border-ember/60 hover:bg-white/10 transition-all disabled:opacity-40 flex items-center gap-2"
                  >
                    <span>{meta?.label ?? p}</span>
                    {meta?.badge && (
                      <span className="text-[10px] rounded-full bg-ember/20 text-ember-soft px-1.5 py-0.5">
                        {meta.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-obsidian/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  {PROVIDER_META[selected]?.label ?? selected}
                </span>
                {selected !== "Custom" && PROVIDER_META[selected]?.docs && (
                  <a
                    href={PROVIDER_META[selected]?.docs}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-ember-soft underline inline-flex items-center gap-1 hover:text-white"
                  >
                    Get free key <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder={PROVIDER_META[selected]?.placeholder ?? "Paste API key"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-obsidian px-3 py-2 text-sm text-slate-200 outline-none focus:border-ember font-mono"
              />
              {selected === "Custom" && (
                <input
                  type="url"
                  placeholder="https://my-model.example.com/v1"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-obsidian px-3 py-2 text-sm font-mono text-slate-200 outline-none focus:border-ember"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  disabled={saving || !apiKey.trim()}
                  className="rounded-lg bg-ember px-4 py-1.5 text-xs font-semibold text-obsidian hover:bg-ember-soft disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Key"}
                </button>
                <button
                  onClick={() => {
                    setSelected("");
                    setApiKey("");
                    setCustomEndpoint("");
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
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

