import { NextResponse } from "next/server";
const { SolapiMessageService } = require("solapi");

export async function POST(req: Request) {
  try {
    console.log("👉 ENV Check:", {
      key: process.env.NEXT_PUBLIC_SOLAPI_API_KEY,
      secret: process.env.NEXT_PUBLIC_SOLAPI_API_SECRET,
      from: process.env.NEXT_PUBLIC_SMS_FROM,
    });

    const messageService = new SolapiMessageService(
      process.env.NEXT_PUBLIC_SOLAPI_API_KEY,
      process.env.NEXT_PUBLIC_SOLAPI_API_SECRET
    );
    const { phone, message } = await req.json();

    const result = await messageService.send({
      to: phone,
      from: process.env.NEXT_PUBLIC_SMS_FROM,
      text: message,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
