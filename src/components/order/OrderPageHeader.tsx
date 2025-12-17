import { Apple } from "lucide-react";

export default function OrderPageHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-700 mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
        <Apple className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 fill-current" />
        주문하기
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
        신선한 사과를 주문해주세요
      </p>
    </div>
  );
}
