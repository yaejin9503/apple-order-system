"use client";

import { Apple } from "lucide-react";
import { useState } from "react";

import LoadingModal from "@/src/components/LoadingModal";
import { useOrderForm } from "@/src/hooks/order/useOrderForm";
import { Postcode } from "@/src/components/Postcode";
import OrderPageHeader from "@/src/components/order/OrderPageHeader";
import AccountInfo from "@/src/components/order/AccountInfo";
import ProductSelector from "@/src/components/order/ProductSelector";
import OrdererSection from "@/src/components/order/OrdererSection";
import ReceiverSection from "@/src/components/order/ReceiverSection";

export default function OrderPage() {
  const {
    selectedProduct,
    setSelectedProduct,
    isSameAsOrderer,
    formData,
    isSubmitting,
    handleSameAsOrderer,
    handleOrdererChange,
    handleReceiverChange,
    handleReceiverQuickFill,
    handleSubmit,
  } = useOrderForm();

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleAddressComplete = (address: string) => {
    handleReceiverChange("address", address);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 py-6 sm:py-8 md:py-12 px-4"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        <OrderPageHeader />
        <AccountInfo />

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8"
        >
          <ProductSelector
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
          />

          {/* <OrdererSection
            ordererName={formData.ordererName}
            ordererPhone={formData.ordererPhone}
            onOrdererChange={handleOrdererChange}
          />

          <div className="mb-6 sm:mb-8 flex items-center justify-center">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer bg-orange-50 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-orange-300 hover:bg-orange-100 transition-colors">
              <input
                type="checkbox"
                checked={isSameAsOrderer}
                onChange={(e) => handleSameAsOrderer(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-orange-900 font-bold text-sm sm:text-base md:text-lg">
                주문자와 받는 분이 동일합니다!
              </span>
            </label>
          </div> */}

          <ReceiverSection
            receiverName={formData.receiverName}
            receiverPhone={formData.receiverPhone}
            address={formData.address}
            detailAddress={formData.detailAddress}
            isSameAsOrderer={isSameAsOrderer}
            onReceiverChange={handleReceiverChange}
            onAddressSearch={() => setIsPostcodeOpen(true)}
            onQuickFill={handleReceiverQuickFill}
          />

          <div className="flex gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 rounded-full text-base sm:text-lg md:text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              돌아가기
            </button>
            <button
              type="submit"
              className="flex-1 group relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                <Apple className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                주문하기
              </span>

              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </button>
          </div>
        </form>
      </div>

      {isSubmitting && <LoadingModal isOpen={isSubmitting} />}

      <Postcode
        isOpen={isPostcodeOpen}
        onClose={() => setIsPostcodeOpen(false)}
        onComplete={handleAddressComplete}
      />
    </div>
  );
}
