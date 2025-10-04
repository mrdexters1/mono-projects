"use client";

import { AuthForm } from "@hardware/components/Auth/AuthForm";
import { fetchBotResponse } from "@hardware/components/chatBot/fetchBotResponse";
import { Button } from "@ui";
import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";
import { ChatBot } from "./components/chatBot/chatBot";

export default function Home() {
  const { data: session } = useSession();

  const fetchBotResponseCurry = useCallback(
    ({ text, sessionId }: { text: string; sessionId: string }) =>
      fetchBotResponse({
        text,
        sessionId,
      }),
    [],
  );

  if (!session) {
    return (
      <div className="max-w-[800px] w-full ml-auto">
        <div className="max-w-[480px] w-full mx-auto">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-chat font-inter flex flex-col">
      <Button
        onClick={() => signOut()}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </Button>

      <ChatBot
        fetchBotResponse={fetchBotResponseCurry}
        initialMessages={["Hi there! I'm here to help you build the perfect PC. What do you need?"]}
      />
    </div>
  );
}
