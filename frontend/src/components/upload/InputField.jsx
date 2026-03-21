const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-borderSoft rounded-md
                 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};

export default InputField;