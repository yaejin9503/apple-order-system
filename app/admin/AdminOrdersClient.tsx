"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Apple,
  Check,
  X,
  Truck,
  Pencil,
  RefreshCw,
  FileText,
} from "lucide-react";
import { createClient } from "@/src/libs/supabase/client";
import { Order } from "@/src/types/order";
import PushSubscribeButton from "@/src/components/admin/PushSubscribeButton";
import ExportOrdersModal from "@/src/components/admin/ExportOrdersModal";
import { usePullToRefresh } from "@/src/hooks/usePullToRefresh";
import {
  countPaidOrders,
  formatPaidOrdersAsText,
} from "@/src/libs/exportOrders";

type FilterKey = "all" | "unpaid" | "unshipped" | "active";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "unpaid", label: "입금 전" },
  { key: "unshipped", label: "발송 전" },
  { key: "active", label: "취소 제외" },
];

export default function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const exportText = useMemo(() => formatPaidOrdersAsText(orders), [orders]);
  const exportCount = useMemo(() => countPaidOrders(orders), [orders]);

  const refreshOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setOrders(data as Order[]);
  }, [supabase]);

  const { pullDistance, isRefreshing, threshold } = usePullToRefresh({
    onRefresh: refreshOrders,
  });

  const filtered = useMemo(() => {
    switch (filter) {
      case "unpaid":
        return orders.filter((o) => !o.paid && !o.cancelled);
      case "unshipped":
        return orders.filter((o) => !o.shipped && !o.cancelled);
      case "active":
        return orders.filter((o) => !o.cancelled);
      default:
        return orders;
    }
  }, [orders, filter]);

  const toggleFlag = async (
    order: Order,
    field: "paid" | "shipped" | "cancelled",
  ) => {
    const next = !order[field];
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, [field]: next } : o)),
    );

    const { error } = await supabase
      .from("orders")
      .update({ [field]: next })
      .eq("id", order.id);

    if (error) {
      alert(`업데이트 실패: ${error.message}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, [field]: !next } : o)),
      );
    }
  };

  const startMemoEdit = (order: Order) => {
    setEditingMemoId(order.id);
    setMemoDraft(order.memo ?? "");
  };

  const saveMemo = async (order: Order) => {
    const value = memoDraft.trim() || null;
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, memo: value } : o)),
    );
    setEditingMemoId(null);

    const { error } = await supabase
      .from("orders")
      .update({ memo: value })
      .eq("id", order.id);

    if (error) {
      alert(`메모 저장 실패: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const counts = useMemo(
    () => ({
      total: orders.length,
      unpaid: orders.filter((o) => !o.paid && !o.cancelled).length,
      unshipped: orders.filter((o) => !o.shipped && !o.cancelled).length,
      cancelled: orders.filter((o) => o.cancelled).length,
    }),
    [orders],
  );

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 0 || isRefreshing;

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 sm:p-6"
      style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        transform: `translateY(${isRefreshing ? threshold : pullDistance}px)`,
        transition: pullDistance === 0 || isRefreshing ? "transform 0.2s" : "none",
      }}
    >
      {showIndicator && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-lg p-2 flex items-center justify-center"
          style={{
            transform: `translateX(-50%) translateY(${isRefreshing ? threshold - 40 : pullDistance - 40}px)`,
            opacity: pullProgress,
            transition: pullDistance === 0 || isRefreshing ? "transform 0.2s, opacity 0.2s" : "none",
          }}
        >
          <RefreshCw
            className={`w-6 h-6 text-red-600 ${isRefreshing ? "animate-spin" : ""}`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${pullProgress * 360}deg)`,
            }}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-red-700 flex items-center gap-2">
            <Apple className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            주문 관리
          </h1>
          <div className="flex items-center gap-2">
            <PushSubscribeButton />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-full text-sm font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <StatCard label="전체" value={counts.total} color="gray" />
          <StatCard label="입금 전" value={counts.unpaid} color="red" />
          <StatCard label="발송 전" value={counts.unshipped} color="orange" />
          <StatCard label="취소" value={counts.cancelled} color="purple" />
        </div>

        {/* Filters + Export */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
                filter === f.key
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-red-400"
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 bg-white border-blue-400 text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            입금 완료 내보내기
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {exportCount}
            </span>
          </button>
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
            해당 조건의 주문이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl shadow-lg p-4 sm:p-5 border-l-4 ${
                  order.cancelled
                    ? "border-purple-500 opacity-60"
                    : order.shipped
                      ? "border-green-500"
                      : order.paid
                        ? "border-blue-500"
                        : "border-red-500"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </span>
                      {order.cancelled && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          취소
                        </span>
                      )}
                      {order.paid && !order.cancelled && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          입금완료
                        </span>
                      )}
                      {order.shipped && !order.cancelled && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          발송완료
                        </span>
                      )}
                    </div>

                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                      🛒 {order.product}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <Field
                        label="주문자"
                        value={`${order.receiver_name} (${order.receiver_phone})`}
                      />
                      <Field
                        label="주소"
                        value={`${order.address}${order.detail_address ? ` ${order.detail_address}` : ""}`}
                        full
                      />
                    </div>

                    {/* Memo */}
                    <div className="mt-3">
                      {editingMemoId === order.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={memoDraft}
                            onChange={(e) => setMemoDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveMemo(order);
                              if (e.key === "Escape") setEditingMemoId(null);
                            }}
                            autoFocus
                            placeholder="메모..."
                            className="flex-1 px-3 py-1.5 rounded-lg border-2 border-yellow-400 focus:outline-none text-sm"
                          />
                          <button
                            onClick={() => saveMemo(order)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingMemoId(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startMemoEdit(order)}
                          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-yellow-700 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            {order.memo || "메모 추가"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2 sm:w-32">
                    <ActionToggle
                      active={order.paid}
                      onClick={() => toggleFlag(order, "paid")}
                      activeLabel="입금완료"
                      inactiveLabel="입금 전"
                      icon={<Check className="w-4 h-4" />}
                      color="blue"
                      disabled={order.cancelled}
                    />
                    <ActionToggle
                      active={order.shipped}
                      onClick={() => toggleFlag(order, "shipped")}
                      activeLabel="발송완료"
                      inactiveLabel="발송 전"
                      icon={<Truck className="w-4 h-4" />}
                      color="green"
                      disabled={order.cancelled}
                    />
                    <ActionToggle
                      active={order.cancelled}
                      onClick={() => toggleFlag(order, "cancelled")}
                      activeLabel="취소됨"
                      inactiveLabel="취소"
                      icon={<X className="w-4 h-4" />}
                      color="purple"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExportOrdersModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        text={exportText}
        count={exportCount}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "gray" | "red" | "orange" | "purple";
}) {
  const colors = {
    gray: "bg-white text-gray-700",
    red: "bg-red-50 text-red-700 border-red-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div
      className={`rounded-xl border-2 border-gray-200 p-3 shadow-sm ${colors[color]}`}
    >
      <p className="text-xs font-bold opacity-80">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <span className="font-bold text-gray-500 mr-2">{label}</span>
      <span className="text-gray-800 break-all">{value}</span>
    </div>
  );
}

function ActionToggle({
  active,
  onClick,
  activeLabel,
  inactiveLabel,
  icon,
  color,
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  activeLabel: string;
  inactiveLabel: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple";
  disabled?: boolean;
}) {
  const activeColors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
  };
  const inactiveColors = {
    blue: "bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50",
    green:
      "bg-white border-2 border-green-300 text-green-700 hover:bg-green-50",
    purple:
      "bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? activeColors[color] : inactiveColors[color]
      }`}
    >
      {icon}
      {active ? activeLabel : inactiveLabel}
    </button>
  );
}
