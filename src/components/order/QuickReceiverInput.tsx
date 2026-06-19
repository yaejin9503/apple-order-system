"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { parseOrderText } from "@/src/libs/parseOrderText";

interface QuickReceiverInputProps {
  onFilled: (info: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
  }) => void;
  disabled?: boolean;
}

export default function QuickReceiverInput({
  onFilled,
  disabled = false,
}: QuickReceiverInputProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = async () => {
    setError(null);

    const result = parseOrderText(text);
    if (!result.ok || !result.data) {
      setError(result.errors.join("\n"));
      return;
    }

    const { address, detailAddress, name, phone } = result.data;

    setIsLoading(true);
    try {
      const res = await fetch("/api/validate-address", {
        method: "POST",
        body: JSON.stringify({ query: address }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "주소 검증에 실패했습니다.");
        return;
      }

      onFilled({
        name,
        phone,
        address: data.address,
        detailAddress,
      });
      setText("");
    } catch (e) {
      console.error(e);
      setError("주소 검증 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="text-gray-800 font-bold text-sm sm:text-base md:text-lg">
          받는 분 정보 한번에 붙여넣기
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-700 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-700 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            주소 · 이름 · 연락처가 포함된 문자를 그대로 붙여넣고 아래 버튼을
            눌러주세요.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled || isLoading}
            rows={5}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-yellow-500 focus:outline-none text-sm sm:text-base resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={
              "예시\n서울시 서대문구 모래내로 XX길 XX\n X동 XX호\n010 XXXX XXXX\n홍길동"
            }
          />
          {error && (
            <p className="text-red-600 text-xs sm:text-sm mt-2 whitespace-pre-line font-bold">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleApply}
            disabled={disabled || isLoading || !text.trim()}
            className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-colors"
          >
            {isLoading ? "주소 검증 중..." : "자동 입력"}
          </button>
        </div>
      )}
    </div>
  );
}
