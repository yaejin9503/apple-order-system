import {
  PRODUCT_CATEGORIES,
  ProductCategoryMeta,
  formatProductValue,
} from "@/src/libs/productCategories";
import { Product, ProductCategory } from "@/src/types/product";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductSelect: (product: Product) => void;
  products: Product[];
}

const HEADER_COLORS: Record<ProductCategoryMeta["color"], string> = {
  red: "text-red-600",
  orange: "text-orange-600",
  purple: "text-purple-600",
  green: "text-green-600",
};

const SELECTED_STYLES: Record<ProductCategoryMeta["color"], string> = {
  red: "border-red-600 bg-red-50 shadow-lg scale-105",
  orange: "border-orange-600 bg-orange-50 shadow-lg scale-105",
  purple: "border-purple-600 bg-purple-50 shadow-lg scale-105",
  green: "border-green-600 bg-green-50 shadow-lg scale-105",
};

const HOVER_STYLES: Record<ProductCategoryMeta["color"], string> = {
  red: "hover:border-red-400 hover:bg-red-50",
  orange: "hover:border-orange-400 hover:bg-orange-50",
  purple: "hover:border-purple-400 hover:bg-purple-50",
  green: "hover:border-green-400 hover:bg-green-50",
};

const PRICE_COLORS: Record<ProductCategoryMeta["color"], string> = {
  red: "text-red-700",
  orange: "text-orange-700",
  purple: "text-purple-700",
  green: "text-green-700",
};

export default function ProductSelector({
  selectedProduct,
  onProductSelect,
  products,
}: ProductSelectorProps) {
  const grouped: Record<ProductCategory, Product[]> = {
    apple_5kg: [],
    apple_10kg: [],
    blueberry_1kg: [],
    pumpkin_10kg: [],
  };
  for (const p of products) {
    grouped[p.category]?.push(p);
  }

  return (
    <div className="pb-6 mb-6 sm:mb-8 sm:pb-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-red-700 mb-4 sm:mb-6 text-center">
        🍎 상품 선택 <span className="text-red-600">*</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {PRODUCT_CATEGORIES.map((cat) => {
          const items = grouped[cat.key];
          if (items.length === 0) return null;
          return (
            <div key={cat.key} className="space-y-2 sm:space-y-3">
              <h3
                className={`text-base sm:text-lg font-bold ${HEADER_COLORS[cat.color]} mb-2`}
              >
                {cat.title}
              </h3>
              {items.map((product) => {
                const value = formatProductValue(
                  cat.key,
                  product.label,
                  product.price_text,
                );
                const isSelected = selectedProduct === value;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => onProductSelect(product)}
                    className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? SELECTED_STYLES[cat.color]
                        : `border-gray-300 bg-white ${HOVER_STYLES[cat.color]}`
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-bold text-gray-700">
                        {product.label}
                      </span>
                      <span
                        className={`text-base sm:text-lg font-bold ${PRICE_COLORS[cat.color]}`}
                      >
                        {product.price_text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
