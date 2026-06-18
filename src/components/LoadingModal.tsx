import { Apple } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingModalProps {
  isOpen: boolean;
}

const STEPS = [
  { at: 0, label: "주문 정보를 확인하고 있어요" },
  { at: 2, label: "문자 메시지를 발송하고 있어요" },
  { at: 6, label: "거의 다 됐어요, 조금만 기다려주세요" },
  { at: 10, label: "응답을 기다리고 있어요" },
];

const ESTIMATED_SECONDS = 10;

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      setElapsed((Date.now() - startedAt) / 1000);
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // 10초까지는 95%에 가까워지도록, 그 이후는 95~99% 사이에서 천천히 증가
  const progress =
    elapsed < ESTIMATED_SECONDS
      ? (elapsed / ESTIMATED_SECONDS) * 95
      : 95 + Math.min(4, (elapsed - ESTIMATED_SECONDS) * 0.5);

  const currentStep =
    [...STEPS].reverse().find((s) => elapsed >= s.at) ?? STEPS[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Apple className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 fill-current animate-spin" />
          </div>

          <h3
            className="text-xl sm:text-2xl font-black text-red-700 mb-2"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            주문 중입니다...
          </h3>

          <p
            className="text-sm sm:text-base text-gray-700 font-medium min-h-6 transition-all"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            {currentStep.label}
          </p>

          <p
            className="mt-1 text-xs sm:text-sm text-gray-500"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            문자 발송에는 약 {ESTIMATED_SECONDS}초 정도 소요됩니다
          </p>

          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-linear-to-r from-red-600 to-orange-600 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className="mt-2 flex items-center justify-between text-xs text-gray-500"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <span>{Math.floor(progress)}%</span>
            <span>{elapsed.toFixed(1)}초 경과</span>
          </div>
        </div>
      </div>
    </div>
  );
}
