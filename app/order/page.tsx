"use client";

import { Apple, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const router = useRouter();
  const [isSameAsOrderer, setIsSameAsOrderer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [formData, setFormData] = useState({
    ordererName: "",
    ordererPhone: "",
    receiverName: "",
    receiverPhone: "",
    address: "",
  });

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

  const handleSameAsOrderer = (checked: boolean) => {
    setIsSameAsOrderer(checked);
    if (checked) {
      setFormData({
        ...formData,
        receiverName: formData.ordererName,
        receiverPhone: formData.ordererPhone,
      });
    }
  };

  const handleOrdererChange = (
    field: "ordererName" | "ordererPhone",
    value: string
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (isSameAsOrderer) {
      if (field === "ordererName") {
        newFormData.receiverName = value;
      } else if (field === "ordererPhone") {
        newFormData.receiverPhone = value;
      }
      setFormData(newFormData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert("상품을 선택해주세요!");
      return;
    }

    // 상품 정보 파싱 (예: "5키로 16과 (4만5천원)" -> 각 부분 분리)
    const productInfo = selectedProduct.match(
      /(\d+키로)\s+(\d+과)\s+\(([^)]+)\)/
    );
    const weight = productInfo ? productInfo[1] : "";
    const count = productInfo ? productInfo[2] : "";
    const price = productInfo ? productInfo[3] : "";

    let message = "";

    if (isSameAsOrderer) {
      // 주문자와 받는 분이 동일한 경우
      message = `[사과 주문 접수]\n상품: ${weight} ${count}\n가격: ${price}\n\n주문자: ${formData.ordererName}\n연락처: ${formData.ordererPhone}\n주소: ${formData.address}`;
    } else {
      // 주문자와 받는 분이 다른 경우
      message = `[사과 주문 접수]\n상품: ${weight} ${count}\n가격: ${price}\n\n주문자: ${formData.ordererName}\n주문자 연락처: ${formData.ordererPhone}\n\n받는 분: ${formData.receiverName}\n받는 분 연락처: ${formData.receiverPhone}\n주소: ${formData.address}`;
    }

    const songPhone = process.env.NEXT_PUBLIC_SONG_PHONE || "";
    const res = await fetch("/api/send-sms", {
      method: "POST",
      body: JSON.stringify({ phone: songPhone, message }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("문자 발송 완료!!!!");
      router.push("/");
    } else {
      alert("문자 발송 실패!!!!");
    }
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
                {[
                  { label: "16과", price: "4만5천원" },
                  { label: "17과", price: "4만3천원" },
                  { label: "19과", price: "3만9천원" },
                ].map((product) => (
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
                {[
                  { label: "16과", price: "8만5천원" },
                  { label: "17과", price: "8만원" },
                  { label: "19과", price: "7만3천원" },
                ].map((product) => (
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
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
                  이름 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.ordererName}
                  onChange={(e) =>
                    handleOrdererChange("ordererName", e.target.value)
                  }
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:outline-none transition-colors text-base sm:text-lg"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
                  연락처 <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.ordererPhone}
                  onChange={(e) =>
                    handleOrdererChange("ordererPhone", e.target.value)
                  }
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:outline-none transition-colors text-base sm:text-lg"
                  placeholder="010-0000-0000"
                />
              </div>
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
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
                  이름 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.receiverName}
                  onChange={(e) =>
                    setFormData({ ...formData, receiverName: e.target.value })
                  }
                  disabled={isSameAsOrderer}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-base sm:text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
                  연락처 <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.receiverPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, receiverPhone: e.target.value })
                  }
                  disabled={isSameAsOrderer}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-base sm:text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="010-0000-0000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
                  주소 <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-base sm:text-lg resize-none"
                  placeholder="배송받으실 주소를 입력해주세요"
                />
              </div>
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
    </div>
  );
}
