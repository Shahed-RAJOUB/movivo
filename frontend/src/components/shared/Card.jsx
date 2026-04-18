import { theme } from "../../theme/theme";

export default function Card({
  title,
  subtitle,
  children,
  className = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 ${onClick ? "cursor-pointer transition-all hover:-translate-y-0.5" : ""} ${className}`}
      style={{
        background: theme.colors.background,
        boxShadow: theme.shadow.card,
      }}
    >
      {title && (
        <>
          <div
            className="text-sm font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              className="text-xs mt-0.5"
              style={{ color: theme.colors.textSecondary }}
            >
              {subtitle}
            </div>
          )}

          <div
            className="w-7 h-0.5 rounded mt-2 mb-4"
            style={{ background: theme.colors.primary }}
          />
        </>
      )}

      {children}
    </div>
  );
}