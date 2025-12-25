export function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 border-4 border-dark bg-background text-white font-pixel text-xs ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
  );
}
