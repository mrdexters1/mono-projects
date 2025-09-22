"use client";

import type { BotResponse, PCPart } from "@hardware/components/chatBot/useChatBot";
import { useEffect, useRef } from "react";
import type { ChatBotMessage } from "./useChatBot";

export const ChatMessages = ({
  messages,
  isResponseLoading,
}: {
  messages: ChatBotMessage[];
  isResponseLoading: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    Promise.resolve(scrollRef.current).then((div) => {
      div?.scrollTo({ top: div.scrollHeight, behavior: "smooth" });
    });
  }, []);

  return (
    <div ref={scrollRef}>
      {messages.map((msg, index) =>
        msg.sender === "user" ? (
          <ChatBubbleUser
            key={index}
            text={msg.text}
          />
        ) : (
          <ChatBubbleRobot
            key={index}
            text={msg.text}
            payload={msg.payload}
          />
        ),
      )}
      {isResponseLoading && <Loader />}
    </div>
  );
};

const ChatBubbleRobot = ({ text, payload }: { text?: string; payload?: BotResponse }) => (
  <ChatBubble icon="Robot">
    {text && <div>{text}</div>}
    {payload && <HardwareConfig data={payload} />}
  </ChatBubble>
);

const ChatBubbleUser = ({ text }: { text?: string }) => <ChatBubble icon="User">{text}</ChatBubble>;

const ChatBubble = ({
  icon,
  children,
  className,
}: React.PropsWithChildren<{ icon: React.ReactNode; className?: string }>) => (
  <div className={className}>
    <div>{icon}</div>
    <div>{children}</div>
  </div>
);

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

const DOTS_COUNT = 3;
const Loader = () => {
  return (
    <div>
      {Array.from({ length: DOTS_COUNT }).map((_, i) => (
        <div key={i} />
      ))}
    </div>
  );
};
