import { Order } from "@/src/types/order";

function splitProduct(product: string): { name: string; priceText: string } {
  const match = product.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), priceText: match[2].trim() };
  }
  return { name: product, priceText: "" };
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
      const { name, priceText } = splitProduct(o.product);
      return [
        name,
        priceText,
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
