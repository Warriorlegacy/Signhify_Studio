import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServerFn } from "@tanstack/react-start";
import { scrollStudioChat } from "@/lib/scroll-studio.functions";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export function ChatInterface({ 
  projectId,
  onUpdatePreview
}: { 
  projectId: string | null;
  onUpdatePreview: (data: { html: string; css: string; js: string }) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(scrollStudioChat);

  useEffect(() => {
    if (!projectId) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Welcome to Scroll Studio! Describe the cinematic website you want to build."
      }]);
      return;
    }
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let currentProjectId = projectId;
      
      const data = await chatFn({ data: { projectId: currentProjectId, message: userMsg.content } });
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message || "I've updated the site based on your request."
      }]);
      
      if (data.html || data.css || data.js) {
        onUpdatePreview({
          html: data.html || "",
          css: data.css || "",
          js: data.js || ""
        });
      }
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-foreground"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-muted text-foreground flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border bg-background">
        <div className="relative flex items-end bg-muted/50 border border-border/50 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="E.g., A cinematic hero section for a space travel app..."
            className="min-h-[60px] max-h-[200px] w-full resize-none border-0 focus-visible:ring-0 bg-transparent p-3 text-sm"
          />
          <div className="p-2">
            <Button 
              size="icon" 
              className="h-8 w-8 rounded-lg" 
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          AI can make mistakes. Verify important changes.
        </p>
      </div>
    </div>
  );
}