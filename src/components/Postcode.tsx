import DaumPostcodeEmbed from "react-daum-postcode";

interface PostcodeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (address: string) => void;
}

export const Postcode = ({ isOpen, onClose, onComplete }: PostcodeProps) => {
  if (!isOpen) return null;

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onComplete(fullAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          주소 검색
        </h3>
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </div>
    </div>
  );
};
