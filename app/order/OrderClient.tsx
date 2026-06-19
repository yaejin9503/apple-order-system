"use client";

import { Apple, Landmark } from "lucide-react";
import { useState } from "react";

import LoadingModal from "@/src/components/LoadingModal";
import { useOrderForm } from "@/src/hooks/order/useOrderForm";
import { Postcode } from "@/src/components/Postcode";
import OrderPageHeader from "@/src/components/order/OrderPageHeader";
import ProductSelector from "@/src/components/order/ProductSelector";
import ReceiverSection from "@/src/components/order/ReceiverSection";
import AccountInfo from "@/src/components/order/AccountInfo";
import { Product } from "@/src/types/product";

export default function OrderClient({ products }: { products: Product[] }) {
  const {
    selectedProduct,
    setSelectedProduct,
    isSameAsOrderer,
    formData,
    isSubmitting,
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

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8"
        >
          <ProductSelector
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            products={products}
          />

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

          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
              💳 결제 방법
            </h3>
            <div className="flex items-center justify-center gap-2 p-4 sm:p-5 rounded-xl border-2 border-yellow-500 bg-yellow-50 text-yellow-900 font-bold text-sm sm:text-base shadow-md">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
              무통장 입금
            </div>
            <div className="mt-3 sm:mt-4">
              <AccountInfo />
            </div>
          </div>

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
