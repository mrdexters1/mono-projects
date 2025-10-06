"use client";

import { AuthForm } from "@hardware/components/Auth/AuthForm";
import { ChatBot } from "@hardware/components/chatBot/chatBot";
import { fetchBotResponse } from "@hardware/components/chatBot/fetchBotResponse";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import LogoutButton from "../LogoutButton";

function useActiveUser(serverUserId: string) {
  const { data: clientSession, status } = useSession();

  const userId = useMemo(() => clientSession?.user?.id ?? serverUserId, [clientSession?.user?.id, serverUserId]);

  const authed = Boolean(clientSession?.user?.id || serverUserId);
  const loading = status === "loading";

  return { userId, authed, loading };
}

export default function HomePage({
  userId: serverUserId,
  initialMessages,
}: {
  userId: string;
  initialMessages: string[];
}) {
  const { userId, authed, loading } = useActiveUser(serverUserId);

  if (!authed && loading) {
    return <div className="h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="max-w-[800px] w-full ml-auto">
        <div className="max-w-[480px] w-full mx-auto">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <>
      <LogoutButton />

      <ChatBot
        fetchBotResponse={fetchBotResponse}
        initialMessages={initialMessages}
        userId={userId}
      />
    </>
  );
}
