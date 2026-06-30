import { ProductCategory } from "@/src/types/product";

export interface ProductCategoryMeta {
  key: ProductCategory;
  title: string;
  weight: string;
  name: string;
  emoji: string;
  color: "red" | "orange" | "purple" | "green";
}

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  {
    key: "apple_5kg",
    title: "5키로",
    weight: "5키로",
    name: "사과",
    emoji: "🍎",
    color: "red",
  },
  {
    key: "apple_10kg",
    title: "10키로",
    weight: "10키로",
    name: "사과",
    emoji: "🍎",
    color: "orange",
  },
  {
    key: "blueberry_1kg",
    title: "1키로",
    weight: "1키로",
    name: "블루베리",
    emoji: "🫐",
    color: "purple",
  },
  {
    key: "pumpkin_10kg",
    title: "10키로",
    weight: "10키로",
    name: "호박",
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
  priceText: string,
): string {
  const meta = PRODUCT_CATEGORY_BY_KEY[category];
  return `${meta.weight} ${label} (${priceText})`;
}

export function formatTotalWeight(unitKg: number, quantity: number): string {
  if (!unitKg) return `${quantity}개`;
  return `${unitKg * quantity}kg`;
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatOrderTitle(
  category: ProductCategory,
  label: string,
  unitKg: number,
  unitPrice: number,
  quantity: number,
): string {
  const name = PRODUCT_CATEGORY_BY_KEY[category]?.name ?? "";
  const totalKg = unitKg * quantity;
  const totalPrice = unitPrice * quantity;
  const trimmedLabel = label.trim();
  const titlePart =
    name && trimmedLabel && name !== trimmedLabel
      ? `${name} ${trimmedLabel}`
      : trimmedLabel || name;
  return `${totalKg}kg ${titlePart} (${formatPrice(totalPrice)})`.replace(
    /\s+/g,
    " ",
  );
}
