interface FormTextareaProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function FormTextarea({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}: FormTextareaProps) {
  return (
    <div className={className}>
      <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base md:text-lg">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-base sm:text-lg resize-none"
        placeholder={placeholder}
      />
    </div>
  );
}
