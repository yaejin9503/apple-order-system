import { Apple } from "lucide-react";
import FormInput from "@/src/components/order/FormInput";

interface OrdererSectionProps {
  ordererName: string;
  ordererPhone: string;
  onOrdererChange: (field: "ordererName" | "ordererPhone", value: string) => void;
}

export default function OrdererSection({
  ordererName,
  ordererPhone,
  onOrdererChange,
}: OrdererSectionProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-t-xl sm:rounded-t-2xl -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
          <Apple className="w-5 h-5 sm:w-6 sm:h-6" />
          주문하시는 분
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <FormInput
          label="이름"
          required
          type="text"
          value={ordererName}
          onChange={(value) => onOrdererChange("ordererName", value)}
          placeholder="이름을 입력해주세요"
        />
        <FormInput
          label="연락처"
          required
          type="tel"
          value={ordererPhone}
          onChange={(value) => onOrdererChange("ordererPhone", value)}
          placeholder="010-0000-0000"
        />
      </div>
    </div>
  );
}
