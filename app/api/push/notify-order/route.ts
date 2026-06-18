import { NextResponse } from "next/server";
import { sendPushToAll } from "@/src/libs/push";

export async function POST(req: Request) {
  try {
    const { product, ordererName } = await req.json();

    const productInfo: RegExpMatchArray | null = product?.match(
      /(\d+키로)\s+(\d+과)\s+\(([^)]+)\)/,
    );
    const weight = productInfo ? productInfo[1] : "";
    const count = productInfo ? productInfo[2] : "";
    const productType = count === "블루베리" ? "블루베리" : "사과";

    const title = `[${productType} 주문 접수]`;
    const body = `${weight} ${count} / 주문자: ${ordererName ?? "(미입력)"}`;

    const result = await sendPushToAll({
      title,
      body,
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
