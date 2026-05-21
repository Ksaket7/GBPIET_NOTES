const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  required = false,
}) => {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="app-input"
      />
    </label>
  );
};

export default InputField;
