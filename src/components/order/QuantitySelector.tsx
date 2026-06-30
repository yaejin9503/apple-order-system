import { Minus, Plus } from "lucide-react";

import { formatPrice } from "@/src/libs/productCategories";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  unitPrice: number;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;
const QUICK_PICKS = [1, 2, 3, 4, 5];

export default function QuantitySelector({
  quantity,
  onChange,
  unitPrice,
}: QuantitySelectorProps) {
  const clamp = (n: number) =>
    Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, Math.floor(n)));

  const handleDecrement = () => onChange(clamp(quantity - 1));
  const handleIncrement = () => onChange(clamp(quantity + 1));

  return (
    <div className="pb-6 mb-6 sm:mb-8 sm:pb-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-red-700 mb-4 sm:mb-6 text-center">
        🔢 수량 선택 <span className="text-red-600">*</span>
      </h2>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= MIN_QUANTITY}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-red-300 bg-white text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all active:scale-95"
          aria-label="수량 감소"
        >
          <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="min-w-[80px] sm:min-w-[100px] text-center">
          <span className="text-3xl sm:text-4xl font-black text-red-700">
            {quantity}
          </span>
          <span className="text-lg sm:text-xl font-bold text-gray-600 ml-1">
            개
          </span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= MAX_QUANTITY}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-red-300 bg-white text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all active:scale-95"
          aria-label="수량 증가"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {QUICK_PICKS.map((n) => {
          const isSelected = quantity === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 text-sm sm:text-base font-bold transition-all ${
                isSelected
                  ? "border-red-600 bg-red-600 text-white shadow-lg scale-110"
                  : "border-gray-300 bg-white text-gray-700 hover:border-red-400 hover:bg-red-50"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {unitPrice > 0 && (
        <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <span className="text-sm sm:text-base font-bold text-gray-700">
            총 결제금액
          </span>
          <span className="text-xl sm:text-2xl font-black text-red-700">
            {formatPrice(unitPrice * quantity)}
          </span>
        </div>
      )}
    </div>
  );
}
