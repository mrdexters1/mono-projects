import type { BotResponse } from "@hardware/components/chatBot/useChatBot";
import { asString, isRecord } from "@toolbox/helpers";
import { fetchJSON } from "@utils/api/fetchJSON";
import { createParamsValidator } from "@utils/createParamsValidator";
import { withErrorHandler } from "@utils/withErrorHandler";
import { NextResponse } from "next/server";

const WEBHOOK_URL = process.env.N8N_WEBHOOK;

if (!WEBHOOK_URL) {
  throw new Error("Missing environment variable: N8N_WEBHOOK");
}

const isTextResp = (json: unknown): json is { text?: string; output?: string } =>
  isRecord(json) && ("text" in json || "output" in json);

const isHardwareConfig = (json: unknown): json is Array<{ output: BotResponse }> =>
  Array.isArray(json) && json.length > 0 && "output" in json[0];

const handleBadResponse = async (resp: Response, { json }: { json: unknown }) => {
  const respText = JSON.stringify(json) ?? (await resp.text());
  return {
    text: ["Responded with error:", respText].join("\n"),
  };
};

const getValidBody = createParamsValidator("body", {
  text: asString,
  sessionId: asString,
});

export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const { text, sessionId } = getValidBody(body);

  const response = await fetchJSON({
    url: WEBHOOK_URL,
    method: "POST",
    body: { text, sessionId },
    response: isTextResp,
    handleBadResponse,
  });

  if (isHardwareConfig(response)) {
    return NextResponse.json({
      response: "Вот подходящая конфигурация для вашего случая:",
      data: response[0].output,
    });
  }

  if (isTextResp(response)) {
    return NextResponse.json({
      response: response?.text || response?.output || "No response",
    });
  }

  return NextResponse.json({
    response: "Получен неожиданный формат ответа",
  });
});
