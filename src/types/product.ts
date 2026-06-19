export type ProductCategory =
  | "apple_5kg"
  | "apple_10kg"
  | "blueberry_1kg"
  | "pumpkin_10kg";

export interface Product {
  id: string;
  category: ProductCategory;
  label: string;
  price: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
