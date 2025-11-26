"use client";

import { Apple, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const router = useRouter();
  const [isSameAsOrderer, setIsSameAsOrderer] = useState(false);
  const [copied, setCopied] = useState(false);
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

    let message = "";

    if (isSameAsOrderer) {
      // 주문자와 받는 분이 동일한 경우
      message = `[사과 주문 접수]\n주문자: ${formData.ordererName}\n연락처: ${formData.ordererPhone}\n주소: ${formData.address}`;
    } else {
      // 주문자와 받는 분이 다른 경우
      message = `[사과 주문 접수]\n주문자: ${formData.ordererName}\n주문자 연락처: ${formData.ordererPhone}\n\n받는 분: ${formData.receiverName}\n받는 분 연락처: ${formData.receiverPhone}\n주소: ${formData.address}`;
    }

    const songPhone = process.env.NEXT_PUBLIC_SONG_PHONE || "";
    const res = await fetch("/api/send-sms", {
      method: "POST",
      body: JSON.stringify({ phone: songPhone, message }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("문자 발송 완료!");
      router.push("/");
    } else {
      alert("문자 발송 실패!");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-red-700 mb-3 flex items-center justify-center gap-3">
            <Apple className="w-12 h-12 fill-current" />
            주문하기
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            신선한 사과를 주문해주세요
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-500 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-900 text-sm font-bold mb-1">
                입금 계좌
              </p>
              <p className="text-yellow-800 text-xl font-bold">
                {accountNumber}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  복사됨!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  복사
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* 주문하시는 분 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-t-2xl -mx-8 -mt-8 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Apple className="w-6 h-6" />
                주문하시는 분
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  이름 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.ordererName}
                  onChange={(e) =>
                    handleOrdererChange("ordererName", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-lg"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  연락처 <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.ordererPhone}
                  onChange={(e) =>
                    handleOrdererChange("ordererPhone", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-lg"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
          </div>

          {/* 동일 체크박스 */}
          <div className="mb-8 flex items-center justify-center">
            <label className="flex items-center gap-3 cursor-pointer bg-orange-50 px-6 py-3 rounded-full border-2 border-orange-300 hover:bg-orange-100 transition-colors">
              <input
                type="checkbox"
                checked={isSameAsOrderer}
                onChange={(e) => handleSameAsOrderer(e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-orange-900 font-bold text-lg">
                주문자와 받는 분이 동일합니다
              </span>
            </label>
          </div>

          {/* 받는 분 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-t-2xl -mx-8 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Apple className="w-6 h-6" />
                받는 분
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="010-0000-0000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  주소 <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg resize-none"
                  placeholder="배송받으실 주소를 입력해주세요"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              돌아가기
            </button>
            <button
              type="submit"
              className="flex-1 group relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button Content */}
              <span className="relative flex items-center justify-center gap-2">
                <Apple className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
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
