import { Order } from "@/src/types/order";

function splitProduct(product: string): { name: string; price: string } {
  const match = product.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), price: match[2].trim() };
  }
  return { name: product, price: "" };
}

function formatAddress(order: Order): string {
  return order.detail_address
    ? `${order.address} ${order.detail_address}`
    : order.address;
}

export function formatOrdersToForwardAsText(orders: Order[]): string {
  const target = orders.filter(
    (o) => o.paid && !o.shipped && !o.cancelled,
  );
  if (target.length === 0) return "";

  return target
    .map((o) => {
      const { name, price } = splitProduct(o.product);
      return [
        name,
        price,
        o.receiver_name,
        o.receiver_phone,
        formatAddress(o),
      ].join("\n");
    })
    .join("\n\n");
}

export function countOrdersToForward(orders: Order[]): number {
  return orders.filter((o) => o.paid && !o.shipped && !o.cancelled).length;
}
