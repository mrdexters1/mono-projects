"use client";

import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

export const ChatInputForm = ({ onSubmit, disabled }: { onSubmit: (input: string) => void; disabled?: boolean }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 max-w-3xl mx-auto"
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Hardware Picker AI anything..."
        className="flex-1 h-12 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
      />
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="icon"
        className="h-12 w-12 rounded-xl bg-gradient-accent hover:opacity-90 transition flex items-center justify-center"
      >
        <Send className="w-5 h-5 text-background stroke-[1.8]" />
      </Button>
    </form>
  );
};
