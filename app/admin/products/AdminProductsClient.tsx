"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Apple,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { createClient } from "@/src/libs/supabase/client";
import { Product, ProductCategory } from "@/src/types/product";
import {
  PRODUCT_CATEGORIES,
  ProductCategoryMeta,
} from "@/src/libs/productCategories";

interface DraftProduct {
  label: string;
  price: string;
}

const COLOR_STYLES: Record<
  ProductCategoryMeta["color"],
  {
    border: string;
    bg: string;
    text: string;
    button: string;
  }
> = {
  red: {
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    button: "bg-red-600 hover:bg-red-700",
  },
  orange: {
    border: "border-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  green: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    button: "bg-green-600 hover:bg-green-700",
  },
};

export default function AdminProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftProduct>({
    label: "",
    price: "",
  });
  const [addingCategory, setAddingCategory] = useState<ProductCategory | null>(
    null,
  );
  const [addDraft, setAddDraft] = useState<DraftProduct>({
    label: "",
    price: "",
  });

  const grouped = useMemo(() => {
    const map: Record<ProductCategory, Product[]> = {
      apple_5kg: [],
      apple_10kg: [],
      blueberry_1kg: [],
      pumpkin_10kg: [],
    };
    for (const p of products) {
      map[p.category]?.push(p);
    }
    for (const key of Object.keys(map) as ProductCategory[]) {
      map[key].sort((a, b) => a.sort_order - b.sort_order);
    }
    return map;
  }, [products]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditDraft({ label: product.label, price: product.price });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ label: "", price: "" });
  };

  const saveEdit = async (product: Product) => {
    const label = editDraft.label.trim();
    const price = editDraft.price.trim();
    if (!label || !price) {
      alert("품목명과 가격을 입력해주세요.");
      return;
    }

    const prev = products;
    setProducts((current) =>
      current.map((p) => (p.id === product.id ? { ...p, label, price } : p)),
    );
    setEditingId(null);

    const { error } = await supabase
      .from("products")
      .update({ label, price })
      .eq("id", product.id);

    if (error) {
      alert(`수정 실패: ${error.message}`);
      setProducts(prev);
    }
  };

  const toggleActive = async (product: Product) => {
    const next = !product.is_active;
    const prev = products;
    setProducts((current) =>
      current.map((p) =>
        p.id === product.id ? { ...p, is_active: next } : p,
      ),
    );

    const { error } = await supabase
      .from("products")
      .update({ is_active: next })
      .eq("id", product.id);

    if (error) {
      alert(`상태 변경 실패: ${error.message}`);
      setProducts(prev);
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!confirm(`'${product.label}' 상품을 삭제하시겠습니까?`)) return;

    const prev = products;
    setProducts((current) => current.filter((p) => p.id !== product.id));

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
      setProducts(prev);
    }
  };

  const move = async (product: Product, direction: -1 | 1) => {
    const siblings = grouped[product.category];
    const idx = siblings.findIndex((p) => p.id === product.id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= siblings.length) return;
    const target = siblings[targetIdx];

    const prev = products;
    setProducts((current) =>
      current.map((p) => {
        if (p.id === product.id) return { ...p, sort_order: target.sort_order };
        if (p.id === target.id) return { ...p, sort_order: product.sort_order };
        return p;
      }),
    );

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase
        .from("products")
        .update({ sort_order: target.sort_order })
        .eq("id", product.id),
      supabase
        .from("products")
        .update({ sort_order: product.sort_order })
        .eq("id", target.id),
    ]);

    if (e1 || e2) {
      alert(`순서 변경 실패: ${e1?.message ?? e2?.message}`);
      setProducts(prev);
    }
  };

  const startAdd = (category: ProductCategory) => {
    setAddingCategory(category);
    setAddDraft({ label: "", price: "" });
  };

  const cancelAdd = () => {
    setAddingCategory(null);
    setAddDraft({ label: "", price: "" });
  };

  const saveAdd = useCallback(
    async (category: ProductCategory) => {
      const label = addDraft.label.trim();
      const price = addDraft.price.trim();
      if (!label || !price) {
        alert("품목명과 가격을 입력해주세요.");
        return;
      }

      const siblings = grouped[category];
      const nextOrder =
        siblings.length === 0
          ? 0
          : Math.max(...siblings.map((p) => p.sort_order)) + 1;

      const { data, error } = await supabase
        .from("products")
        .insert({
          category,
          label,
          price,
          sort_order: nextOrder,
          is_active: true,
        })
        .select()
        .single();

      if (error || !data) {
        alert(`추가 실패: ${error?.message ?? "알 수 없는 오류"}`);
        return;
      }

      setProducts((current) => [...current, data as Product]);
      cancelAdd();
    },
    [addDraft, grouped, supabase],
  );

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 sm:p-6"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-red-700 flex items-center gap-2">
            <Apple className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            상품 관리
          </h1>
          <Link
            href="/admin"
            className="flex items-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-full text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            주문 관리로
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {PRODUCT_CATEGORIES.map((cat) => {
            const list = grouped[cat.key];
            const styles = COLOR_STYLES[cat.color];
            return (
              <div
                key={cat.key}
                className={`bg-white rounded-2xl shadow-lg border-l-4 ${styles.border} p-4 sm:p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-lg sm:text-xl font-black ${styles.text}`}>
                    {cat.emoji} {cat.title}
                    <span className="ml-2 text-xs text-gray-500 font-medium">
                      ({categoryDescription(cat.key)})
                    </span>
                  </h2>
                  <button
                    onClick={() => startAdd(cat.key)}
                    className={`flex items-center gap-1 ${styles.button} text-white px-3 py-1.5 rounded-full text-xs font-bold`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    추가
                  </button>
                </div>

                <div className="space-y-2">
                  {list.length === 0 && addingCategory !== cat.key && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      등록된 상품이 없습니다.
                    </p>
                  )}

                  {list.map((product, idx) => {
                    const isEditing = editingId === product.id;
                    return (
                      <div
                        key={product.id}
                        className={`rounded-xl border-2 p-3 ${
                          product.is_active
                            ? `${styles.bg} border-gray-200`
                            : "bg-gray-100 border-gray-200 opacity-60"
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editDraft.label}
                                onChange={(e) =>
                                  setEditDraft((d) => ({
                                    ...d,
                                    label: e.target.value,
                                  }))
                                }
                                placeholder="품목명 (예: 16과)"
                                className="flex-1 px-3 py-1.5 rounded-lg border-2 border-gray-300 focus:border-gray-500 focus:outline-none text-sm"
                              />
                              <input
                                type="text"
                                value={editDraft.price}
                                onChange={(e) =>
                                  setEditDraft((d) => ({
                                    ...d,
                                    price: e.target.value,
                                  }))
                                }
                                placeholder="가격 (예: 4만5천원)"
                                className="flex-1 px-3 py-1.5 rounded-lg border-2 border-gray-300 focus:border-gray-500 focus:outline-none text-sm"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => saveEdit(product)}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                              >
                                <Check className="w-3.5 h-3.5" />
                                저장
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                              >
                                <X className="w-3.5 h-3.5" />
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">
                                  {product.label}
                                </span>
                                {!product.is_active && (
                                  <span className="bg-gray-300 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    비활성
                                  </span>
                                )}
                              </div>
                              <span className={`text-sm font-bold ${styles.text}`}>
                                {product.price}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => move(product, -1)}
                                disabled={idx === 0}
                                title="위로"
                                className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              <button
                                onClick={() => move(product, 1)}
                                disabled={idx === list.length - 1}
                                title="아래로"
                                className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              <button
                                onClick={() => toggleActive(product)}
                                title={product.is_active ? "비활성화" : "활성화"}
                                className="p-1.5 rounded-md hover:bg-white"
                              >
                                {product.is_active ? (
                                  <Eye className="w-3.5 h-3.5 text-gray-700" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => startEdit(product)}
                                title="수정"
                                className="p-1.5 rounded-md hover:bg-white"
                              >
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product)}
                                title="삭제"
                                className="p-1.5 rounded-md hover:bg-white"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {addingCategory === cat.key && (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 p-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={addDraft.label}
                            onChange={(e) =>
                              setAddDraft((d) => ({
                                ...d,
                                label: e.target.value,
                              }))
                            }
                            autoFocus
                            placeholder="품목명 (예: 16과)"
                            className="flex-1 px-3 py-1.5 rounded-lg border-2 border-gray-300 focus:border-gray-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={addDraft.price}
                            onChange={(e) =>
                              setAddDraft((d) => ({
                                ...d,
                                price: e.target.value,
                              }))
                            }
                            placeholder="가격 (예: 4만5천원)"
                            className="flex-1 px-3 py-1.5 rounded-lg border-2 border-gray-300 focus:border-gray-500 focus:outline-none text-sm"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => saveAdd(cat.key)}
                            className={`flex items-center gap-1 ${styles.button} text-white px-3 py-1.5 rounded-lg text-xs font-bold`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            추가
                          </button>
                          <button
                            onClick={cancelAdd}
                            className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            <X className="w-3.5 h-3.5" />
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function categoryDescription(key: ProductCategory): string {
  switch (key) {
    case "apple_5kg":
      return "사과 5kg";
    case "apple_10kg":
      return "사과 10kg";
    case "blueberry_1kg":
      return "블루베리 1kg";
    case "pumpkin_10kg":
      return "호박 10kg";
  }
}
