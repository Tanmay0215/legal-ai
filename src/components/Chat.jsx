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
import legalApiService from "@/services/legalApi";
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

export default function Chat({ hasDocument = false, documentInfo = null }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const viewportRef = useRef(null);

  // Update initial message when document status changes
  useEffect(() => {
    const initialMessage = {
      role: "assistant",
      content: hasDocument
        ? `Hi! I'm ready to answer questions about your uploaded document: ${
            documentInfo?.fileName || "your document"
          }.`
        : "Hi! I'm your Legal AI assistant. Please upload a PDF document first, then ask me questions about it.",
    };

    setMessages([initialMessage]);
  }, [hasDocument, documentInfo?.fileName]);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await legalApiService.healthCheck();
        setError("");
      } catch (err) {
        setError(
          "Backend API is not available. Please ensure the server is running."
        );
      }
    };

    checkBackend();
  }, []);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    // Add loading message
    const loadingMessage = { role: "assistant", content: "", isLoading: true };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await legalApiService.askQuestion(trimmed);

      if (!response.success) {
        throw new Error(response.answer || "Failed to get response");
      }

      // Replace loading message with actual response
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: response.answer,
          isLoading: false,
        };
        return newMessages;
      });

      // Chat was successful (document is available)
    } catch (err) {
      console.error("Error calling chat API:", err);
      let errorMessage = err.message || "Failed to get response from AI";

      // Handle specific error cases
      if (
        err.message.includes("No documents uploaded") ||
        err.message.includes("Chatbot not initialized")
      ) {
        errorMessage =
          "Please upload a PDF document first before asking questions.";
      }

      setError(errorMessage);

      // Replace loading message with error
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: errorMessage,
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
        {!hasDocument && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Upload a PDF document using the File Upload tab to start chatting
              about it.
            </p>
          </div>
        )}
        {hasDocument && documentInfo && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Document loaded:</strong> {documentInfo.fileName}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Type: {documentInfo.documentType} | Confidence:{" "}
              {(documentInfo.confidence * 100).toFixed(1)}%
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
          placeholder="Ask a question about your uploaded document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
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
