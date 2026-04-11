import { useAuth } from "../../context/AuthContext";
import { theme } from "../../theme/theme";

export default function Topbar() {
  const { userData, logout } = useAuth();

  return (
    <div
      className="w-full sticky top-0 z-10 flex items-center justify-between px-8 py-4"
      style={{
        background: theme.colors.background,
        borderBottom: "1px solid #eee",
      }}
    >
      {/* Left */}
      <div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* User Name */}
        <div
          className="text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          {userData?.name || "Therapeut:in"}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
          {userData?.name?.[0] || "T"}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-sm px-3 py-1.5 rounded transition-all hover:bg-gray-100"
          style={{ color: theme.colors.textPrimary }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}