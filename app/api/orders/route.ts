import { NextResponse } from "next/server";
import { createAdminClient } from "@/src/libs/supabase/admin";

interface CreateOrderBody {
  product: string;
  quantity: number;
  unit_price: number;
  unit_kg: number;
  orderer_name: string;
  orderer_phone: string;
  receiver_name: string;
  receiver_phone: string;
  address: string;
  detail_address: string | null;
  is_same_as_orderer: boolean;
  memo: string | null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateOrderBody>;

    if (
      !body.product ||
      typeof body.quantity !== "number" ||
      typeof body.unit_price !== "number" ||
      typeof body.unit_kg !== "number" ||
      !body.orderer_name ||
      !body.orderer_phone ||
      !body.receiver_name ||
      !body.receiver_phone ||
      !body.address
    ) {
      return NextResponse.json(
        { ok: false, error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("orders").insert({
      product: body.product,
      quantity: body.quantity,
      unit_price: body.unit_price,
      unit_kg: body.unit_kg,
      orderer_name: body.orderer_name,
      orderer_phone: body.orderer_phone,
      receiver_name: body.receiver_name,
      receiver_phone: body.receiver_phone,
      address: body.address,
      detail_address: body.detail_address ?? null,
      is_same_as_orderer: body.is_same_as_orderer ?? false,
      memo: body.memo ?? null,
    });

    if (error) {
      console.error("주문 저장 실패:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
