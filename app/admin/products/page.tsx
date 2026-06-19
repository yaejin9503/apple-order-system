import { createClient } from "@/src/libs/supabase/server";
import { Product } from "@/src/types/product";
import AdminProductsClient from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <h1 className="text-2xl font-black text-red-700 mb-2">
            상품 조회 실패
          </h1>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminProductsClient initialProducts={(products ?? []) as Product[]} />
  );
}
