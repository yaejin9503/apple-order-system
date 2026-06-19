import { createClient } from "@/src/libs/supabase/server";
import { Product } from "@/src/types/product";
import OrderClient from "./OrderClient";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const products = (data ?? []) as Product[];

  return <OrderClient products={products} />;
}
