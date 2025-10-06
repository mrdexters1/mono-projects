import type { BotResponse } from "@hardware/components/chatBot/useChatBot";
import { fetchJSON } from "@utils/api/fetchJSON";

export const fetchBotResponse = async (body: { text: string; userId: string }) =>
  await fetchJSON({
    url: "/api/chat",
    method: "POST",
    body,
    response: fetchJSON.as<{ response: string; data: BotResponse }>,
  });
