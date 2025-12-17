"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function AccountInfo() {
  const [copied, setCopied] = useState(false);
  const accountNumber = `${process.env.NEXT_PUBLIC_ACCOUNT} 카카오뱅크 송상은`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_ACCOUNT || ""
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-yellow-900 text-xs sm:text-sm font-bold mb-1">
            입금 계좌
          </p>
          <p className="text-yellow-800 text-sm sm:text-base md:text-xl font-bold break-all">
            {accountNumber}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-bold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 shadow-md shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">복사됨!</span>
              <span className="sm:hidden">✓</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">복사</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
