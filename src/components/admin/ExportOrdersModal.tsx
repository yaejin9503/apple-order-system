"use client";

import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

interface ExportOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  count: number;
}

export default function ExportOrdersModal({
  isOpen,
  onClose,
  text,
  count,
}: ExportOrdersModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("복사에 실패했습니다. 텍스트를 직접 선택해서 복사해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            입금 완료 주문 텍스트 ({count}건)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-6 py-4">
          {count === 0 ? (
            <p className="text-center text-gray-500 py-12">
              입금 완료된 주문이 없습니다.
            </p>
          ) : (
            <textarea
              readOnly
              value={text}
              className="w-full h-[50vh] p-3 border-2 border-gray-200 rounded-xl text-sm font-mono resize-none focus:outline-none focus:border-red-400 bg-gray-50"
            />
          )}
        </div>

        {count > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl font-bold transition-colors"
            >
              닫기
            </button>
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors text-white ${
                copied ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  복사됨!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  텍스트 복사
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
