import { NextResponse } from "next/server";

export const withErrorHandler = <T extends (req: Request) => Promise<Response>>(handler: T): T => {
  return (async (req: Request) => {
    try {
      return await handler(req);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
  }) as T;
};
