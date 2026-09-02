import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  Check,
  Code2,
  PenTool,
  BarChart3,
  Lightbulb,
  CloudSun,
  Bot,
  User,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { assistantChat } from "@/lib/assistant-chat.functions";

// Types
export type ChatTheme = "default" | "blue" | "violet" | "emerald";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  modelUsed?: string;
}

const SUGGESTIONS = [
  { id: "code", label: "Code", icon: Code2, prompt: "Write a high-performance React hook for debounce with TypeScript." },
  { id: "write", label: "Write", icon: PenTool, prompt: "Draft a high-converting landing page copy for an AI SaaS." },
  { id: "analyze", label: "Analyze", icon: BarChart3, prompt: "Analyze this system architecture for potential concurrency bottlenecks." },
  { id: "brainstorm", label: "Brainstorm", icon: Lightbulb, prompt: "Brainstorm 5 innovative micro-SaaS ideas in Developer Tooling." },
  { id: "weather", label: "Weather", icon: CloudSun, prompt: "Give me an executive weather and flight intelligence summary." },
];

const THEMES: { id: ChatTheme; name: string; gradient: string; glow: string }[] = [
  { id: "default", name: "Default", gradient: "from-zinc-200 to-zinc-400", glow: "rgba(255,255,255,0.2)" },
  { id: "blue", name: "Blue", gradient: "from-cyan-400 to-blue-500", glow: "rgba(56,189,248,0.3)" },
  { id: "violet", name: "Violet", gradient: "from-fuchsia-400 to-violet-500", glow: "rgba(168,85,247,0.3)" },
  { id: "emerald", name: "Emerald", gradient: "from-teal-300 to-emerald-500", glow: "rgba(52,211,153,0.3)" },
];

export function AssistantChat({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ChatTheme>("default");
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatFn = useServerFn(assistantChat);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isStreaming) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setIsStreaming(true);

    try {
      const { content, providerUsed } = await chatFn({
        data: {
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        },
      });

      const assistantMsg: ChatMessage = {
        id: "ast_" + Date.now(),
        role: "assistant",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: providerUsed,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "The assistant is unavailable right now.";
      if (msg.includes("Signhify AI is available on paid plans") || msg.includes("decrypted")) {
        toast.error(msg);
      } else {
        toast.error("Assistant request failed. Please try again.");
      }
      const errorMsg: ChatMessage = {
        id: "ast_err_" + Date.now(),
        role: "assistant",
        content: `⚠️ ${msg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getThemeGlow = () => {
    switch (currentTheme) {
      case "blue":
        return "border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]";
      case "violet":
        return "border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.15)]";
      case "emerald":
        return "border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]";
      default:
        return "border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]";
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col h-[700px] rounded-3xl bg-zinc-950/90 backdrop-blur-2xl border ${getThemeGlow()} overflow-hidden transition-all duration-500 ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Signhify Assistant UI</h3>
            <p className="text-[11px] text-zinc-400">Production AI Agent Interface</p>
          </div>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/5">
          <span className="text-[11px] text-zinc-400 mr-1">Theme</span>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setCurrentTheme(theme.id)}
              className={`w-4 h-4 rounded-full transition-all duration-200 bg-gradient-to-tr ${theme.gradient} ${
                currentTheme === theme.id ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-zinc-950" : "opacity-60 hover:opacity-100"
              }`}
              title={theme.name}
            />
          ))}
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="ml-2 text-zinc-400 hover:text-red-400 transition-colors p-1"
              title="Clear Thread"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center mb-6 shadow-xl"
            >
              <Bot className="w-8 h-8 text-amber-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              How can I help you today?
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mb-8">
              Describe your software architecture, request frontend code, or generate full-stack blueprints.
            </p>

            {/* Quick action chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSend(s.prompt)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div className={`relative max-w-2xl rounded-2xl p-4.5 ${
                m.role === "user"
                  ? "bg-zinc-800/90 text-white rounded-br-none border border-white/10"
                  : "bg-zinc-900/80 text-zinc-200 rounded-bl-none border border-white/5"
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{m.content}</div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-400">
                  <span>{m.timestamp} {m.modelUsed && `• ${m.modelUsed}`}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-white transition-colors p-1"
                      title="Copy content"
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-zinc-300" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {isStreaming && (
          <div className="flex gap-4 items-center text-xs text-zinc-400">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="animate-pulse">Signhify AI is generating a response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray Box */}
      <div className="p-4 border-t border-white/5 bg-zinc-900/30">
        <div className="relative rounded-2xl bg-zinc-900/90 border border-white/10 p-2 shadow-inner focus-within:border-white/20 transition-all">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Send a message..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 px-3 py-1.5 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5">
            {/* Engine badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-white/5">
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>Signhify AI</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toast.info("Attachment uploader ready")}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsListening(!isListening);
                  if (!isListening) toast.info("Voice input listening...");
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? "text-red-400 bg-red-500/10 animate-pulse" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
                title="Voice input"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white text-black flex items-center justify-center shadow transition-all active:scale-95 ml-1"
                title="Send"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
