interface FormInputProps {
  label: string;
  required?: boolean;
  type?: "text" | "tel" | "email";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormInput({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
}: FormInputProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "tel") {
      const input = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출
      let formatted = "";

      if (input.length <= 3) {
        formatted = input;
      } else if (input.length <= 7) {
        formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
      } else {
        formatted = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(
          7,
          11
        )}`;
      }

      onChange(formatted);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={className}>
      <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type === "tel" ? "text" : type}
        required={required}
        value={value}
        onChange={handlePhoneChange}
        disabled={disabled}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:outline-none transition-colors text-base sm:text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={placeholder}
        maxLength={type === "tel" ? 13 : undefined}
      />
    </div>
  );
}
