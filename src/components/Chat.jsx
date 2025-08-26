import React, { useMemo, useRef, useState } from "react";
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

function ChatMessage({ role, content }) {
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
        {content}
      </div>
      {isUser && (
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default function Chat({ onSend }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything legal." },
  ]);
  const [input, setInput] = useState("");
  const viewportRef = useRef(null);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    Promise.resolve(onSend?.(trimmed)).then((reply) => {
      if (reply) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: String(reply) },
        ]);
      }
    });
  }

  const disabled = useMemo(() => input.trim().length === 0, [input]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="border-b">
        <CardTitle>Legal AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="h-[60vh] p-0">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="gap-2">
        <Textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={disabled}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
