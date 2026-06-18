export interface ParsedOrderInfo {
  address: string;
  detailAddress: string;
  name: string;
  phone: string;
}

export interface ParseResult {
  ok: boolean;
  data?: ParsedOrderInfo;
  errors: string[];
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-]/g, "");
  if (!/^010\d{7,8}$/.test(digits)) return null;
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isPhoneLike(line: string): boolean {
  const digits = line.replace(/[\s\-]/g, "");
  return /^010\d{7,8}$/.test(digits);
}

function isNameLike(line: string): boolean {
  return /^[가-힣]{2,4}$/.test(line.trim());
}

export function parseOrderText(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 3) {
    return {
      ok: false,
      errors: ["주소 / 이름 / 연락처가 모두 포함되도록 최소 3줄로 붙여넣어 주세요."],
    };
  }

  let phone: string | null = null;
  let name: string | null = null;
  const addressLines: string[] = [];

  for (const line of lines) {
    if (!phone && isPhoneLike(line)) {
      phone = normalizePhone(line);
      continue;
    }
    if (!name && isNameLike(line)) {
      name = line;
      continue;
    }
    addressLines.push(line);
  }

  const errors: string[] = [];
  if (!phone) errors.push("연락처를 찾을 수 없습니다. (010으로 시작하는 휴대폰 번호)");
  if (!name) errors.push("이름을 찾을 수 없습니다. (한글 2~4자)");
  if (addressLines.length === 0) errors.push("주소를 찾을 수 없습니다.");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: [],
    data: {
      address: addressLines[0],
      detailAddress: addressLines.slice(1).join(" "),
      name: name!,
      phone: phone!,
    },
  };
}
