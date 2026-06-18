import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사과 주문 관리",
  manifest: "/manifest-admin.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "사과관리",
  },
  icons: {
    icon: [
      { url: "/icons/apple-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/apple-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
