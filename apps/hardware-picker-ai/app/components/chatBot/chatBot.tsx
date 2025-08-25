import { ScrollArea } from "@ui";
import { ChatInputForm } from "./ChatInputForm";
import { ChatMessages } from "./ChatMessages";
import { type ChatBotProps, useChatBot } from "./useChatBot";

export const ChatBot = (props: ChatBotProps) => {
  const { messages, isResponseLoading, sendMessage } = useChatBot(props);

  return (
    <>
      <ScrollArea className="flex-1 px-4 py-6">
        <ChatMessages
          messages={messages}
          isResponseLoading={isResponseLoading}
        />
      </ScrollArea>

      <ChatInputForm onSubmit={sendMessage} />
    </>
  );
};
