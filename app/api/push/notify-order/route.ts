import { NextResponse } from "next/server";
import { sendPushToAll } from "@/src/libs/push";

export async function POST() {
  try {
    const result = await sendPushToAll({
      title: "🍎 새 주문이 들어왔어요!",
      body: "눌러서 확인하세요",
      url: "/admin",
      tag: "order",
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("notify-order 실패:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
