import { createClient } from "@/src/libs/supabase/server";
import { Order } from "@/src/types/order";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <h1 className="text-2xl font-black text-red-700 mb-2">
            주문 조회 실패
          </h1>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return <AdminOrdersClient initialOrders={(orders ?? []) as Order[]} />;
}
