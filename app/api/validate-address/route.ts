import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "주소가 비어있습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.KAKAO_REST_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "주소 검증 API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query.trim()
    )}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "주소 검증 요청에 실패했습니다." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const docs: any[] = data.documents ?? [];

    if (docs.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "일치하는 주소를 찾을 수 없습니다. 주소를 다시 확인해주세요.",
      });
    }

    const first = docs[0];
    const road = first.road_address;
    const jibun = first.address;
    const official: string = road?.address_name || jibun?.address_name || "";
    const buildingName: string = road?.building_name || "";
    const zipCode: string = road?.zone_no || "";

    const fullAddress = buildingName
      ? `${official} (${buildingName})`
      : official;

    return NextResponse.json({
      ok: true,
      address: fullAddress,
      zipCode,
    });
  } catch (err) {
    console.error("주소 검증 오류:", err);
    return NextResponse.json(
      { ok: false, error: "주소 검증 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
