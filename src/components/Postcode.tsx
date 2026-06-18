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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center z-10"
        >
          ×
        </button>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pr-8">
          주소 검색
        </h3>
        <div className="flex-1 min-h-0 overflow-hidden">
          <DaumPostcodeEmbed
            onComplete={handleComplete}
            style={{ width: "100%", height: "100%", minHeight: "360px" }}
          />
        </div>
      </div>
    </div>
  );
};
