import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { initializeGemini, getGeminiService } from "@/services/gemini";
import { config, isGeminiConfigured } from "@/config/api";
import { cn } from "@/lib/utils";

function ChatMessage({ role, content, isLoading = false }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] rounded-lg border px-3 py-2",
          "text-sm sm:text-base transition-colors",
          isUser ? "bg-primary text-primary-foreground" : "bg-card"
        )}
      >
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          content
        )}
      </div>
      {isUser && (
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Legal AI assistant. Ask me anything about legal matters.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(config.gemini.apiKey);
  const [error, setError] = useState("");
  const viewportRef = useRef(null);

  // Initialize Gemini service when API key is available
  useEffect(() => {
    if (apiKey) {
      try {
        initializeGemini(apiKey);
        setError("");
      } catch (err) {
        setError("Failed to initialize Gemini service");
      }
    }
  }, [apiKey]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (!apiKey) {
      setError("Please enter your Gemini API key first");
      return;
    }

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    // Add loading message
    const loadingMessage = { role: "assistant", content: "", isLoading: true };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const geminiService = getGeminiService();
      const response = await geminiService.generateContent(trimmed, messages);

      // Replace loading message with actual response
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: response,
          isLoading: false,
        };
        return newMessages;
      });
    } catch (err) {
      console.error("Error calling Gemini:", err);
      setError(err.message || "Failed to get response from AI");

      // Replace loading message with error
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
          isLoading: false,
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }

  const disabled = useMemo(
    () => input.trim().length === 0 || isLoading,
    [input, isLoading]
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <CardTitle>Legal AI Chat</CardTitle>
        {!apiKey && (
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            <label className="text-sm md:text-base font-medium">
              Gemini API Key:
            </label>
            <input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm md:text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        )}
        {error && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full p-3 sm:p-4 md:p-4">
          <div className="flex flex-col gap-2 sm:gap-3">
            {messages.map((m, i) => (
              <ChatMessage
                key={i}
                role={m.role}
                content={m.content}
                isLoading={m.isLoading}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="gap-2 sm:gap-3 flex-shrink-0 p-3 sm:p-4 md:p-6">
        <Textarea
          placeholder={
            apiKey ? "Type your message..." : "Please enter API key first..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={!apiKey || isLoading}
          className="min-h-[40px] sm:min-h-[44px] md:min-h-[48px] resize-none text-sm sm:text-base"
        />
        <Button
          onClick={handleSend}
          disabled={disabled}
          className="px-4 sm:px-6 md:px-8 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">
            {isLoading ? "Sending..." : "Send"}
          </span>
          <span className="sm:hidden">{isLoading ? "..." : "Send"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
