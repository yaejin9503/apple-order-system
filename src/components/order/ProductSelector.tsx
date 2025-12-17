import { APPLE_5KG, APPLE_10KG } from "@/src/libs/const";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductSelect: (product: string) => void;
}

export default function ProductSelector({
  selectedProduct,
  onProductSelect,
}: ProductSelectorProps) {
  return (
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
          {APPLE_5KG.map((product) => {
            const productValue = `5키로 ${product.label} (${product.price})`;
            return (
              <button
                key={`5kg-${product.label}`}
                type="button"
                onClick={() => onProductSelect(productValue)}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedProduct === productValue
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
            );
          })}
        </div>

        {/* 10kg 상품들 */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-orange-600 mb-2">
            10키로
          </h3>
          {APPLE_10KG.map((product) => {
            const productValue = `10키로 ${product.label} (${product.price})`;
            return (
              <button
                key={`10kg-${product.label}`}
                type="button"
                onClick={() => onProductSelect(productValue)}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedProduct === productValue
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
