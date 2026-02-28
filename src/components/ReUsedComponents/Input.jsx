export default function Input({
  type = "text",
  htmlFor = "",
  className = "",
  labelClassName = "",
  placeholder = "",
  value = "",
  min = "",
  max = "",
  onChange,
  children,
  ...rest
}) {
  return (
    <>
      <label htmlFor={htmlFor} className={labelClassName}>
        {children}
      </label>
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        {...rest}
      />
    </>
  );
}
