import { createClient } from "@/src/libs/supabase/server";
import { createAdminClient } from "@/src/libs/supabase/admin";
import { Product } from "@/src/types/product";
import { AddressBookEntry } from "@/src/components/order/AddressBookButton";
import OrderClient from "./OrderClient";

export const dynamic = "force-dynamic";

const ADDRESS_BOOK_EMAIL = process.env.ADDRESS_BOOK_EMAIL?.trim().toLowerCase();

export default async function OrderPage() {
  const supabase = await createClient();

  const [productsResult, userResult] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const products = (productsResult.data ?? []) as Product[];

  const userEmail = userResult.data.user?.email?.trim().toLowerCase();
  const isAddressBookUser = !!ADDRESS_BOOK_EMAIL && userEmail === ADDRESS_BOOK_EMAIL;

  let addressBook: AddressBookEntry[] | null = null;
  if (isAddressBookUser) {
    const admin = createAdminClient();
    const { data: orderRows } = await admin
      .from("orders")
      .select("receiver_name, receiver_phone, address, detail_address")
      .order("created_at", { ascending: false })
      .limit(500);

    const seen = new Set<string>();
    addressBook = [];
    for (const row of orderRows ?? []) {
      const name = row.receiver_name ?? "";
      const phone = row.receiver_phone ?? "";
      const address = row.address ?? "";
      if (!name && !phone && !address) continue;

      const phoneDigits = phone.replace(/\D/g, "");
      const key = phoneDigits || `${name}|${address}`;
      if (seen.has(key)) continue;
      seen.add(key);

      addressBook.push({
        name,
        phone,
        address,
        detailAddress: row.detail_address ?? "",
      });
    }
  }

  return <OrderClient products={products} addressBook={addressBook} />;
}
