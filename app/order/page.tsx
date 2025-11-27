"use client";

import { Apple, Copy, Check } from "lucide-react";
import { useState } from "react";

import FormInput from "@/src/components/order/FormInput";
import FormTextarea from "@/src/components/order/FormTextarea";
import LoadingModal from "@/src/components/LoadingModal";
import { useOrderForm } from "@/src/hooks/order/useOrderForm";
import { APPLE_10KG, APPLE_5KG } from "@/src/libs/const";
import { Postcode } from "@/src/components/Postcode";

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
    handleSubmit,
  } = useOrderForm();

  const [copied, setCopied] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
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

  const handleAddressComplete = (address: string) => {
    handleReceiverChange("address", address);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 py-6 sm:py-8 md:py-12 px-4"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-700 mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <Apple className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 fill-current" />
            주문하기
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
            신선한 사과를 주문해주세요
          </p>
        </div>

        {/* Account Info */}
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

        {/* Order Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8"
        >
          {/* 상품 선택 */}
          <div className="pb-6 mb-6 sm:mb-8 sm:pb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-red-700 mb-4 sm:mb-6 text-center">
              🍎 상품 선택 <span className="text-red-600">*</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* 5kg 상품들 */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-red-600 mb-2">
                  5키로
                </h3>
                {APPLE_5KG.map((product) => (
                  <button
                    key={`5kg-${product.label}`}
                    type="button"
                    onClick={() =>
                      setSelectedProduct(
                        `5키로 ${product.label} (${product.price})`
                      )
                    }
                    className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedProduct ===
                      `5키로 ${product.label} (${product.price})`
                        ? "border-red-600 bg-red-50 shadow-lg scale-105"
                        : "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-bold text-gray-700">
                        {product.label}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-red-700">
                        {product.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 10kg 상품들 */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-orange-600 mb-2">
                  10키로
                </h3>
                {APPLE_10KG.map((product) => (
                  <button
                    key={`10kg-${product.label}`}
                    type="button"
                    onClick={() =>
                      setSelectedProduct(
                        `10키로 ${product.label} (${product.price})`
                      )
                    }
                    className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedProduct ===
                      `10키로 ${product.label} (${product.price})`
                        ? "border-orange-600 bg-orange-50 shadow-lg scale-105"
                        : "border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-bold text-gray-700">
                        {product.label}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-orange-700">
                        {product.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 주문하시는 분 */}
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
                value={formData.ordererName}
                onChange={(value) => handleOrdererChange("ordererName", value)}
                placeholder="이름을 입력해주세요"
              />
              <FormInput
                label="연락처"
                required
                type="tel"
                value={formData.ordererPhone}
                onChange={(value) => handleOrdererChange("ordererPhone", value)}
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          {/* 동일 체크박스 */}
          <div className="mb-6 sm:mb-8 flex items-center justify-center">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer bg-orange-50 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-orange-300 hover:bg-orange-100 transition-colors">
              <input
                type="checkbox"
                checked={isSameAsOrderer}
                onChange={(e) => handleSameAsOrderer(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-orange-900 font-bold text-sm sm:text-base md:text-lg">
                주문자와 받는 분이 동일합니다
              </span>
            </label>
          </div>

          {/* 받는 분 */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-t-xl sm:rounded-t-2xl -mx-4 sm:-mx-6 md:-mx-8 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                <Apple className="w-5 h-5 sm:w-6 sm:h-6" />
                받는 분
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <FormInput
                label="이름"
                required
                type="text"
                value={formData.receiverName}
                onChange={(value) =>
                  handleReceiverChange("receiverName", value)
                }
                disabled={isSameAsOrderer}
                placeholder="이름을 입력해주세요"
              />
              <FormInput
                label="연락처"
                required
                type="tel"
                value={formData.receiverPhone}
                onChange={(value) =>
                  handleReceiverChange("receiverPhone", value)
                }
                disabled={isSameAsOrderer}
                placeholder="010-0000-0000"
              />
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
                  주소 <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.address}
                    readOnly
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-base sm:text-lg bg-gray-50 cursor-pointer"
                    placeholder="주소찾기 버튼을 눌러주세요"
                    onClick={() => setIsPostcodeOpen(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPostcodeOpen(true)}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    주소찾기
                  </button>
                </div>
              </div>
              <FormInput
                label="상세주소"
                type="text"
                value={formData.detailAddress}
                onChange={(value) =>
                  handleReceiverChange("detailAddress", value)
                }
                disabled={!formData.address}
                placeholder={
                  formData.address
                    ? "상세주소를 입력해주세요"
                    : "먼저 주소를 검색해주세요"
                }
              />
            </div>
          </div>

          {/* Submit Button */}
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
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button Content */}
              <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                <Apple className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                주문하기
              </span>

              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </button>
          </div>
        </form>
      </div>

      {/* Loading Modal */}
      {isSubmitting && <LoadingModal isOpen={isSubmitting} />}

      {/* Postcode Modal */}
      <Postcode
        isOpen={isPostcodeOpen}
        onClose={() => setIsPostcodeOpen(false)}
        onComplete={handleAddressComplete}
      />
    </div>
  );
}
