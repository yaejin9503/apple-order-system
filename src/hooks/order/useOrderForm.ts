import { useState } from "react";
import { useRouter } from "next/navigation";

export interface FormData {
  ordererName: string;
  ordererPhone: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
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
      // 상품 정보 파싱 (예: "5키로 16과 (4만5천원)" -> 각 부분 분리)
      const productInfo = selectedProduct.match(
        /(\d+키로)\s+(\d+과)\s+\(([^)]+)\)/
      );
      const weight = productInfo ? productInfo[1] : "";
      const count = productInfo ? productInfo[2] : "";
      const price = productInfo ? productInfo[3] : "";

      let message = "";

      if (isSameAsOrderer) {
        // 주문자와 받는 분이 동일한 경우
        message = `[사과 주문 접수]\n상품: ${weight} ${count}\n가격: ${price}\n\n주문자: ${formData.ordererName}\n연락처: ${formData.ordererPhone}\n주소: ${formData.address}`;
      } else {
        // 주문자와 받는 분이 다른 경우
        message = `[사과 주문 접수]\n상품: ${weight} ${count}\n가격: ${price}\n\n주문자: ${formData.ordererName}\n주문자 연락처: ${formData.ordererPhone}\n\n받는 분: ${formData.receiverName}\n받는 분 연락처: ${formData.receiverPhone}\n주소: ${formData.address}`;
      }

      const songPhone = process.env.NEXT_PUBLIC_SONG_PHONE || "";
      const res = await fetch("/api/send-sms", {
        method: "POST",
        body: JSON.stringify({ phone: songPhone, message }),
      });

      const result = await res.json();
      if (result.ok) {
        alert("문자 발송 완료!!!!");
        router.push("/");
      } else {
        alert("문자 발송 실패!!!!");
      }
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
