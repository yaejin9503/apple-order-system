import { Apple } from "lucide-react";
import FormInput from "@/src/components/order/FormInput";
import QuickReceiverInput from "@/src/components/order/QuickReceiverInput";

interface ReceiverSectionProps {
  receiverName: string;
  receiverPhone: string;
  address: string;
  detailAddress: string;
  isSameAsOrderer: boolean;
  onReceiverChange: (
    field: "receiverName" | "receiverPhone" | "address" | "detailAddress",
    value: string,
  ) => void;
  onAddressSearch: () => void;
  onQuickFill: (info: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
  }) => void;
}

export default function ReceiverSection({
  receiverName,
  receiverPhone,
  address,
  detailAddress,
  isSameAsOrderer,
  onReceiverChange,
  onAddressSearch,
  onQuickFill,
}: ReceiverSectionProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-t-xl sm:rounded-t-2xl -mx-4 sm:-mx-6 md:-mx-8 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
          <Apple className="w-5 h-5 sm:w-6 sm:h-6" />
          주문 하시는 분
        </h2>
      </div>

      <QuickReceiverInput onFilled={onQuickFill} disabled={isSameAsOrderer} />

      <div className="space-y-3 sm:space-y-4">
        <FormInput
          label="이름"
          required
          type="text"
          value={receiverName}
          onChange={(value) => onReceiverChange("receiverName", value)}
          disabled={isSameAsOrderer}
          placeholder="이름을 입력해주세요"
        />
        <FormInput
          label="연락처"
          required
          type="tel"
          value={receiverPhone}
          onChange={(value) => onReceiverChange("receiverPhone", value)}
          disabled={isSameAsOrderer}
          placeholder="010-0000-0000"
        />
        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
            주소 <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              required
              value={address}
              readOnly
              className="w-2/3 flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-base sm:text-lg bg-gray-50 cursor-pointer"
              placeholder="주소찾기 버튼을 눌러주세요"
              onClick={onAddressSearch}
            />
            <button
              type="button"
              onClick={onAddressSearch}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              주소찾기
            </button>
          </div>
        </div>
        <FormInput
          label="상세주소"
          type="text"
          value={detailAddress}
          onChange={(value) => onReceiverChange("detailAddress", value)}
          disabled={!address}
          placeholder={
            address ? "상세주소를 입력해주세요" : "먼저 주소를 검색해주세요"
          }
        />
      </div>
    </div>
  );
}
