"use client";

import type { BotResponse, PCPart } from "@hardware/components/chatBot/useChatBot";
import { Bot, Info, User } from "lucide-react";
import { forwardRef, useEffect, useRef } from "react";
import type { ChatBotMessage } from "./useChatBot";

export const ChatMessages = ({
  messages,
  isResponseLoading,
}: {
  messages: ChatBotMessage[];
  isResponseLoading: boolean;
}) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages?.length ?? 0, !!isResponseLoading]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1;

        if (msg.sender === "user") {
          return (
            <ChatBubbleUser
              key={index}
              text={msg.text}
              ref={isLast ? lastMessageRef : null}
            />
          );
        }

        if (msg.sender === "system") {
          return (
            <ChatBubbleSystem
              key={index}
              text={msg.text}
              ref={isLast ? lastMessageRef : null}
            />
          );
        }

        return (
          <ChatBubbleRobot
            key={index}
            text={msg.text}
            payload={msg.payload}
            ref={isLast ? lastMessageRef : null}
          />
        );
      })}

      {isResponseLoading && <Loader />}
    </div>
  );
};

const ChatBubbleRobot = forwardRef<HTMLDivElement, { text?: string; payload?: BotResponse }>(
  ({ text, payload }, ref) => (
    <ChatBubble
      ref={ref}
      icon={<RobotIcon />}
      className="self-start bg-gray-900/40 border border-border text-foreground rounded-2xl px-4 py-3 shadow-md backdrop-blur-sm"
    >
      {text && <div className="leading-relaxed">{text}</div>}
      {payload && <HardwareConfig data={payload} />}
    </ChatBubble>
  ),
);

const ChatBubbleUser = forwardRef<HTMLDivElement, { text?: string }>(({ text }, ref) => (
  <ChatBubble
    ref={ref}
    icon={<UserIcon />}
    className="self-end bg-gray-900/40 border border-border text-foreground rounded-2xl px-4 py-3 shadow-md backdrop-blur-sm"
  >
    {text}
  </ChatBubble>
));

const ChatBubbleSystem = forwardRef<HTMLDivElement, { text?: string }>(({ text }, ref) => (
  <ChatBubble
    ref={ref}
    icon={<SystemInfo />}
    className="flex items-center justify-center gap-2 self-center text-sm text-muted-foreground italic px-3 py-1"
  >
    {text}
  </ChatBubble>
));

const ChatBubble = forwardRef<HTMLDivElement, React.PropsWithChildren<{ icon: React.ReactNode; className?: string }>>(
  ({ icon, children, className }, ref) => (
    <div
      ref={ref}
      className={`flex items-start gap-3 ${className?.includes("self-end") ? "flex-row-reverse" : ""}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className={className}>{children}</div>
    </div>
  ),
);

ChatBubble.displayName = "ChatBubble";
ChatBubbleUser.displayName = "ChatBubbleUser";
ChatBubbleRobot.displayName = "ChatBubbleRobot";
ChatBubbleSystem.displayName = "ChatBubbleSystem";

const HardwareConfig = ({ data }: { data: BotResponse }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <p className="text-gray-600 mb-4">{data.description}</p>
    <div className="space-y-3">
      {data.parts.map((part: PCPart, index: number) => (
        <div
          key={index}
          className="border-l-4 border-blue-500 pl-3"
        >
          <div className="font-medium text-blue-700">{part.category}</div>
          <div className="font-semibold">{part.name}</div>
          {part.alternatives && (
            <div className="text-sm text-gray-600">Альтернативы: {part.alternatives.join(", ")}</div>
          )}
          {part.notes && <div className="text-sm text-gray-500 mt-1">{part.notes}</div>}
        </div>
      ))}
    </div>
  </div>
);

const Loader = () => (
  <div className="flex gap-2 justify-center items-center text-muted-foreground mt-4">
    <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" />
    <span
      className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    />
    <span
      className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    />
  </div>
);

const RobotIcon = () => (
  <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-background shadow-md">
    <Bot className="w-4 h-4" />
  </div>
);

const UserIcon = () => (
  <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-background shadow-md">
    <User className="w-4 h-4" />
  </div>
);

const SystemInfo = () => (
  <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-background shadow-md">
    <Info className="w-4 h-4" />
  </div>
);
