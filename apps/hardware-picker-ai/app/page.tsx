"use client";

import { ChatHeader } from "@hardware/components/chatBot/ChatHeader";
import { ChatBot } from "@hardware/components/chatBot/chatBot";
import { fetchBotResponse } from "@hardware/components/chatBot/fetchBotResponse";
import { Card, CardContent } from "@ui";
import { useCallback } from "react";

export default function Home() {
  const fetchBotResponseCurry = useCallback(
    ({ text, sessionId }: { text: string; sessionId: string }) =>
      fetchBotResponse({
        text,
        sessionId,
      }),
    [],
  );

  return (
    <div className="h-screen bg-gradient-chat font-inter flex flex-col">
      <ChatHeader />

      <div className="flex-1 p-4 flex justify-center">
        <Card className="w-full max-w-4xl flex flex-col h-full bg-card/95 backdrop-blur-sm border-border/50">
          <CardContent className="flex-1 flex flex-col p-0">
            <ChatBot
              fetchBotResponse={fetchBotResponseCurry}
              initialMessages={["Hi there! I'm here to help you build the perfect PC. What do you need?"]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
