import { Apple } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  console.log("LoadingModal isOpen:", isOpen);
  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
          <div className="text-center">
            {/* Spinning Apple Animation */}
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
              className="text-sm sm:text-base text-gray-600 font-medium"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              잠시만 기다려주세요
            </p>

            {/* Loading Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 h-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
