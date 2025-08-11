"use client";

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
          />
        ),
      )}
      {isResponseLoading && <Loader />}
    </div>
  );
};

const ChatBubbleRobot = ({ text }: { text: string }) => <ChatBubble icon="Robot">{text}</ChatBubble>;

const ChatBubbleUser = ({ text }: { text: string }) => <ChatBubble icon="User">{text}</ChatBubble>;

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
