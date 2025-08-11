"use client";

import { useCallback, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface ChatBotMessage {
  sender: "user" | "bot" | "system";
  text: string;
}

export interface ChatBotProps {
  fetchBotResponse: (props: { text: string; sessionId: string }) => Promise<string>;
  initialMessages: string[];
}

/**
 * Hook for managing the chatbot
 * @param metadata - metadata for the chatbot (chainId, tokenAddress, pairAddress)
 * @param initialMessages - initial messages
 */
export function useChatBot({ initialMessages, fetchBotResponse }: ChatBotProps) {
  const [sessionId] = useLocalStorage<string>("chatSessionId", () => crypto.randomUUID());
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [messages, setMessages] = useState<ChatBotMessage[]>(initialMessages.map((text) => ({ sender: "bot", text })));

  const addMessage = useCallback(
    (sender: ChatBotMessage["sender"], text: ChatBotMessage["text"]) =>
      setMessages((prev) => [...prev, { sender, text }]),
    [],
  );

  const sendMessage = useCallback(
    async (input: string) => {
      const messageText = input.trim();
      if (!messageText) {
        return;
      }

      addMessage("user", messageText);
      setIsResponseLoading(true);

      const botResp = await fetchBotResponse({
        text: messageText,
        sessionId,
      }).catch((err) => {
        console.error("Chat error:", err);
        return String(err) ?? "Connection error, try again.";
      });

      setIsResponseLoading(false);
      addMessage("bot", botResp);
    },
    [addMessage, sessionId, fetchBotResponse],
  );

  return {
    messages,
    isResponseLoading,
    sendMessage,
  };
}
