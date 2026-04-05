export default function Section({ title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {title}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {children}
    </div>
  );
}