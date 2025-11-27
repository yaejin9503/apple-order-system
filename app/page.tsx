"use client";

import { ImageWithFallback } from "@/src/components/ImageWithFallback";
import { APPLE_10KG, APPLE_5KG } from "@/src/libs/const";
import { Apple, Truck, Star, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function App() {
  const [copied, setCopied] = useState(false);
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

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <div className="max-w-4xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-yellow-400">
          <Star className="w-8 h-8 sm:w-12 sm:h-12 fill-current animate-pulse" />
        </div>
        <div className="absolute top-12 right-4 sm:top-20 sm:right-8 text-yellow-300">
          <Star
            className="w-5 h-5 sm:w-8 sm:h-8 fill-current animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <div className="absolute top-4 right-14 sm:top-8 sm:right-24 text-yellow-400">
          <Star
            className="w-4 h-4 sm:w-6 sm:h-6 fill-current animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Header with Image */}
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1635123471750-fc6ada3e3bcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXMlMjBvcmNoYXJkfGVufDF8fHx8MTc2NDEzMzY0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="사과 농장"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Floating Apples Decoration */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6">
            <Apple className="w-10 h-10 sm:w-16 sm:h-16 text-red-500 fill-current drop-shadow-lg" />
          </div>
          <div className="absolute top-6 left-16 sm:top-12 sm:left-28">
            <Apple className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 fill-current drop-shadow-lg" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 sm:px-8 sm:py-6">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-1 sm:mb-2 drop-shadow-lg font-black"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  🍎 송하 농장
                </h1>
                <p
                  className="text-sm sm:text-lg md:text-xl lg:text-2xl opacity-90 font-medium"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  신선한 사과를 직접 농장에서 배송합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-b from-white to-orange-50">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-red-700 mb-1 sm:mb-2 font-black"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              🎁 특별 가격 안내
            </h2>
            <p
              className="text-sm sm:text-base text-gray-600 font-medium"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              최상급 품질의 사과를 합리적인 가격으로!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* 5kg Section */}
            <div>
              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-t-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                  >
                    🍎 5키로
                  </h3>
                  <Apple className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                </div>
              </div>
              <div className="bg-white border-2 sm:border-4 border-red-600 rounded-b-2xl overflow-hidden shadow-lg">
                {APPLE_5KG.map((product, index) => (
                  <PriceRow
                    key={product.label + index}
                    label={product.label}
                    price={product.price}
                    color="red"
                    isFirst={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* 10kg Section */}
            <div>
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-t-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                  >
                    🍎 10키로
                  </h3>
                  <Apple className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                </div>
              </div>
              <div className="bg-white border-2 sm:border-4 border-orange-600 rounded-b-2xl overflow-hidden shadow-lg">
                {APPLE_10KG.map((product, index) => (
                  <PriceRow
                    key={product.label + index}
                    label={product.label}
                    price={product.price}
                    color="orange"
                    isFirst={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-500 p-4 sm:p-6 rounded-2xl shadow-md mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Truck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-700 flex-shrink-0" />
              <div>
                <p
                  className="text-yellow-900 text-base sm:text-lg md:text-xl font-bold"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  ** 전부 택배비 포함
                </p>
                <p
                  className="text-yellow-700 text-sm sm:text-base font-medium"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  안전하고 신속하게 배송해드립니다
                </p>
              </div>
            </div>
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

          {/* Order Button */}
          <div className="flex justify-center">
            <Link href="/order">
              <button
                className="group relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-full text-lg sm:text-xl md:text-2xl font-bold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Button Content */}
                <span className="relative flex items-center gap-2 sm:gap-3">
                  <Apple className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
                  주문하러 가기
                  <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </span>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  price,
  color,
  isFirst = false,
}: {
  label: string;
  price: string;
  color: "red" | "orange";
  isFirst?: boolean;
}) {
  const textColor = color === "red" ? "text-red-700" : "text-orange-700";

  return (
    <div
      className={`flex justify-between items-center px-4 py-3 sm:px-6 sm:py-5 ${
        !isFirst ? "border-t-2 border-gray-100" : ""
      }`}
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <span className="text-base sm:text-lg md:text-xl text-gray-700 font-medium">
        {label}
      </span>
      <span
        className={`text-xl sm:text-2xl md:text-3xl font-bold ${textColor}`}
      >
        {price}
      </span>
    </div>
  );
}
