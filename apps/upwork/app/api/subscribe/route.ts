import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Server not configured: missing API key" }, { status: 500 });
    }

    const groupId = process.env.MAILERLITE_GROUP_ID;

    const payload: Record<string, any> = {
      email,
      fields: {},
    };

    if (name) {
      payload.fields.name = name;
    }

    const mlRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!mlRes.ok) {
      const err = await mlRes.json().catch(() => ({}));
      return NextResponse.json({ message: err?.message || "MailerLite error", errors: err?.errors }, { status: 400 });
    }

    const data = await mlRes.json();

    if (groupId && data?.data?.id) {
      const subId = data.data.id;
      await fetch(`https://connect.mailerlite.com/api/subscribers/${subId}/groups/${groupId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }).catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
