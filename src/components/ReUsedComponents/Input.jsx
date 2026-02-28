export default function Input({
  type = "text",
  className = "",
  placeholder = "",
  value,
  onChange,
  ...rest
}) {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
