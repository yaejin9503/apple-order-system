import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/libs/supabase/client";

export interface FormData {
  ordererName: string;
  ordererPhone: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  detailAddress: string;
}

export interface UseOrderFormReturn {
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  isSameAsOrderer: boolean;
  formData: FormData;
  isSubmitting: boolean;
  handleProductSelect: (productId: string) => void;
  handleSameAsOrderer: (checked: boolean) => void;
  handleOrdererChange: (
    field: "ordererName" | "ordererPhone",
    value: string
  ) => void;
  handleReceiverChange: (field: keyof FormData, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useOrderForm(): UseOrderFormReturn {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [isSameAsOrderer, setIsSameAsOrderer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ordererName: "",
    ordererPhone: "",
    receiverName: "",
    receiverPhone: "",
    address: "",
    detailAddress: "",
  });

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleSameAsOrderer = (checked: boolean) => {
    setIsSameAsOrderer(checked);
    if (checked) {
      setFormData({
        ...formData,
        receiverName: formData.ordererName,
        receiverPhone: formData.ordererPhone,
      });
    }
  };

  const handleOrdererChange = (
    field: "ordererName" | "ordererPhone",
    value: string
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (isSameAsOrderer) {
      if (field === "ordererName") {
        newFormData.receiverName = value;
      } else if (field === "ordererPhone") {
        newFormData.receiverPhone = value;
      }
      setFormData(newFormData);
    }
  };

  const handleReceiverChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert("상품을 선택해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from("orders").insert({
        product: selectedProduct,
        orderer_name: formData.ordererName,
        orderer_phone: formData.ordererPhone,
        receiver_name: isSameAsOrderer
          ? formData.ordererName
          : formData.receiverName,
        receiver_phone: isSameAsOrderer
          ? formData.ordererPhone
          : formData.receiverPhone,
        address: formData.address,
        detail_address: formData.detailAddress || null,
        is_same_as_orderer: isSameAsOrderer,
      });

      if (insertError) {
        console.error("주문 저장 실패:", insertError);
        alert("주문 접수에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      // 사장님께 알림 SMS (실패해도 주문은 이미 DB에 저장됨 - 무시)
      const productInfo = selectedProduct.match(
        /(\d+키로)\s+(\S+)\s+\(([^)]+)\)/
      );
      const weight = productInfo ? productInfo[1] : "";
      const count = productInfo ? productInfo[2] : "";
      const productType = count === "블루베리" ? "블루베리" : "사과";
      const notifyMessage = `[${productType} 주문 접수]\n상품: ${weight} ${count}\n주문자: ${formData.ordererName}\n\n관리자 페이지에서 확인해주세요.`;

      const songPhone = process.env.NEXT_PUBLIC_SONG_PHONE || "";
      fetch("/api/send-sms", {
        method: "POST",
        body: JSON.stringify({ phone: songPhone, message: notifyMessage }),
      }).catch((err) => console.error("알림 SMS 전송 실패:", err));

      alert("주문이 접수되었습니다!");
      router.push("/");
    } catch (error) {
      console.error("주문 처리 중 오류:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedProduct,
    setSelectedProduct,
    isSameAsOrderer,
    formData,
    isSubmitting,
    handleProductSelect,
    handleSameAsOrderer,
    handleOrdererChange,
    handleReceiverChange,
    handleSubmit,
  };
}
