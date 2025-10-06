"use client";

import { ScrollArea } from "@ui";
import { useState } from "react";
import { ChatInputForm } from "./ChatInputForm";
import { ChatMessages } from "./ChatMessages";
import { type ChatBotProps, useChatBot } from "./useChatBot";

export const ChatBot = (props: ChatBotProps) => {
  const { messages, isResponseLoading, sendMessage } = useChatBot(props);
  const [isTyping, _setIsTyping] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-hero text-foreground">
      <ScrollArea className="flex-1 h-full w-full overflow-auto border-r border-border bg-background/60 px-4 py-6">
        <ChatMessages
          messages={messages}
          isResponseLoading={isResponseLoading}
        />
      </ScrollArea>

      <div className="border-t border-r border-border bg-background/60 backdrop-blur-md px-4 py-4">
        <ChatInputForm
          onSubmit={sendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};
