export interface Order {
  id: string;
  created_at: string;
  product: string;
  orderer_name: string;
  orderer_phone: string;
  receiver_name: string;
  receiver_phone: string;
  address: string;
  detail_address: string | null;
  is_same_as_orderer: boolean;
  paid: boolean;
  shipped: boolean;
  cancelled: boolean;
  memo: string | null;
}
