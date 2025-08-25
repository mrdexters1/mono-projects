import { fetchJSON } from "@utils/api/fetchJSON";

export const fetchBotResponse = async (body: { text: string; sessionId: string }) =>
  await fetchJSON({
    url: "/api/chat",
    method: "POST",
    body,
    response: fetchJSON.as<{ response: string }>,
  }).then((data) => data.response);
