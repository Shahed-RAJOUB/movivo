export default function Card({ title, subtitle, children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(120,80,60,0.07)] ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${className}`}
    >
      {title && (
        <>
          <div className="text-sm font-semibold text-[#3d3129]">{title}</div>
          {subtitle && <div className="text-xs text-[#a09488] mt-0.5">{subtitle}</div>}
          <div className="w-7 h-[3px] bg-[#E8594F] rounded mt-2 mb-4" />
        </>
      )}
      {children}
    </div>
  );
}
