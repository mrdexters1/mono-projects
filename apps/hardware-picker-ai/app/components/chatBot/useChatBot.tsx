"use client";

import { useLocalStorage } from "@hooks/useLocalStorage";
import { useCallback, useState } from "react";

export interface PCPart {
  category: string;
  name: string;
  alternatives?: string[];
  notes?: string;
}

export interface BotResponse {
  use_case: string;
  description: string;
  parts: PCPart[];
}

export interface ChatBotMessage {
  sender: "user" | "bot" | "system";
  text?: string;
  payload?: BotResponse;
}

export interface ChatBotProps {
  fetchBotResponse: (props: { text: string; sessionId: string }) => Promise<{ response: string; data?: BotResponse }>;
  initialMessages: string[];
}

/**
 * Hook for managing the chatbot
 * @param initialMessages - initial messages
 */
export function useChatBot({ initialMessages, fetchBotResponse }: ChatBotProps) {
  const [sessionId] = useLocalStorage<string>("chatSessionId", () => crypto.randomUUID());
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [messages, setMessages] = useState<ChatBotMessage[]>(initialMessages.map((text) => ({ sender: "bot", text })));

  const addMessage = useCallback(
    (sender: ChatBotMessage["sender"], text?: string, payload?: BotResponse) =>
      setMessages((prev) => [...prev, { sender, text, payload }]),
    [],
  );

  const sendMessage = useCallback(
    async (input: string) => {
      const messageText = input.trim();
      if (!messageText) return;

      addMessage("user", messageText);
      setIsResponseLoading(true);

      try {
        const { response, data } = await fetchBotResponse({ text: messageText, sessionId });

        if (typeof response === "string") {
          addMessage("bot", response, data);
        } else {
          addMessage("bot", undefined, response);
        }
      } catch (err) {
        console.error("Chat error:", err);
        addMessage("bot", "Connection error, try again.");
      } finally {
        setIsResponseLoading(false);
      }
    },
    [addMessage, sessionId, fetchBotResponse],
  );

  return {
    messages,
    isResponseLoading,
    sendMessage,
  };
}
