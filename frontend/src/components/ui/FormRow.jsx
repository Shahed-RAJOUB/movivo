export default function FormRow({ label, required, children }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-sm min-w-[180px] text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}