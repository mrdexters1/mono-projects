import type { NextRequest } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_KEY = process.env.N8N_KEY || "";
const ORIGIN_ALLOWED = (process.env.ORIGIN_ALLOWED || "https://www.upwork.com,*").split(",");

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allowed = ORIGIN_ALLOWED.some((o) => o === "*" || o.trim() === origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin || "*" : "null",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,x-api-key,authorization",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookUrl = N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: "N8N_WEBHOOK_URL is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(req) },
      });
    }

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(N8N_KEY ? { "x-api-key": N8N_KEY } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await n8nRes.json().catch(() => ({}));
    const status = n8nRes.ok ? 200 : 502;

    const text = (data && (data.text ?? data.output ?? data.answer ?? "")) || "";

    return new Response(JSON.stringify({ text }), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders(req) },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Bad Request";
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(req) },
    });
  }
}
