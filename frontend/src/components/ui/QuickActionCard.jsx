import { theme } from "../../theme/theme";

export default function QuickActionCard({
  title,
  description,
  icon,
  gradient,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="group rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-0.5"
      style={{
        background: theme.colors.background,
        boxShadow: theme.shadow.card,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
        style={{ background: gradient }}
      >
        <span className="text-white">{icon}</span>
      </div>

      {/* Title */}
      <div
        className="text-sm font-semibold"
        style={{ color: theme.colors.textPrimary }}
      >
        {title}
      </div>

      {/* Description */}
      <div
        className="text-xs mt-1"
        style={{ color: theme.colors.textSecondary }}
      >
        {description}
      </div>
    </div>
  );
}