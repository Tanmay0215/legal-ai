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
        className={`max-w-[80%] rounded-lg border px-3 py-2 text-sm ${
          isUser ? "bg-primary text-primary-foreground" : "bg-card"
        }`}
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
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="border-b">
        <CardTitle>Legal AI Chat</CardTitle>
        {!apiKey && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Gemini API Key:</label>
            <input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
      <CardContent className="h-[60vh] p-0">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col gap-3">
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
      <CardFooter className="gap-2">
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
        />
        <Button onClick={handleSend} disabled={disabled}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </CardFooter>
    </Card>
  );
}
