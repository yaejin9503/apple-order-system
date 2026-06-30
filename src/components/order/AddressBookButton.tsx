"use client";

import { useMemo, useState } from "react";
import { BookUser, Search, X } from "lucide-react";

export interface AddressBookEntry {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
}

interface AddressBookButtonProps {
  entries: AddressBookEntry[];
  onSelect: (entry: AddressBookEntry) => void;
  disabled?: boolean;
}

export default function AddressBookButton({
  entries,
  onSelect,
  disabled = false,
}: AddressBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return entries;
    const digits = q.replace(/\D/g, "");
    return entries.filter((e) => {
      const phoneDigits = (e.phone ?? "").replace(/\D/g, "");
      return (
        e.name.toLowerCase().includes(q) ||
        e.address.toLowerCase().includes(q) ||
        (digits && phoneDigits.includes(digits))
      );
    });
  }, [entries, keyword]);

  const handlePick = (entry: AddressBookEntry) => {
    onSelect(entry);
    setIsOpen(false);
    setKeyword("");
  };

  return (
    <>
      <div className="mb-2 sm:mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold border-2 border-orange-400 bg-white text-orange-700 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookUser className="w-4 h-4" />
          주소록
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookUser className="w-5 h-5 text-orange-600" />
                주소록 ({entries.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pt-3 sm:px-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="이름, 연락처, 주소로 검색"
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">
                  {entries.length === 0
                    ? "저장된 주소록이 없습니다."
                    : "검색 결과가 없습니다."}
                </p>
              ) : (
                filtered.map((entry, idx) => (
                  <button
                    key={`${entry.phone}-${idx}`}
                    type="button"
                    onClick={() => handlePick(entry)}
                    className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        {entry.name || "(이름 없음)"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {entry.phone}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 break-all">
                      {entry.address}
                      {entry.detailAddress ? ` ${entry.detailAddress}` : ""}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
