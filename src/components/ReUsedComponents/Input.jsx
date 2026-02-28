export default function Input({
  type = "text",
  htmlFor = "",
  className = "",
  labelClassName = "",
  placeholder = "",
  value,
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
        {...rest}
      />
    </>
  );
}
