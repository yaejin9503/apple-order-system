import { ProductCategory } from "@/src/types/product";

export interface ProductCategoryMeta {
  key: ProductCategory;
  title: string;
  weight: string;
  emoji: string;
  color: "red" | "orange" | "purple" | "green";
}

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  {
    key: "apple_5kg",
    title: "5키로",
    weight: "5키로",
    emoji: "🍎",
    color: "red",
  },
  {
    key: "apple_10kg",
    title: "10키로",
    weight: "10키로",
    emoji: "🍎",
    color: "orange",
  },
  {
    key: "blueberry_1kg",
    title: "1키로",
    weight: "1키로",
    emoji: "🫐",
    color: "purple",
  },
  {
    key: "pumpkin_10kg",
    title: "10키로",
    weight: "10키로",
    emoji: "🎃",
    color: "green",
  },
];

export const PRODUCT_CATEGORY_BY_KEY: Record<
  ProductCategory,
  ProductCategoryMeta
> = PRODUCT_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.key] = cat;
    return acc;
  },
  {} as Record<ProductCategory, ProductCategoryMeta>,
);

export function formatProductValue(
  category: ProductCategory,
  label: string,
  price: string,
): string {
  const meta = PRODUCT_CATEGORY_BY_KEY[category];
  return `${meta.weight} ${label} (${price})`;
}
