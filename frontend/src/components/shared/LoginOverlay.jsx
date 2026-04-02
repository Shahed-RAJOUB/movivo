import { theme } from "../../theme/theme";

export default function LoginOverlay({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  onBack,
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      
      <div
        className="w-full max-w-sm p-8 rounded-2xl animate-fadeIn"
        style={{
          background: theme.colors.background,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          fontFamily: theme.font.body,
        }}
      >
        {/* Title */}
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{
            color: theme.colors.primary,
            fontFamily: theme.font.heading,
          }}
        >
          Login
        </h2>

        {/* Form */}
        <form onSubmit={onLogin} className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded border outline-none transition-all focus:ring-2"
            style={{
              borderColor: "#e5e0da",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded border outline-none transition-all focus:ring-2"
            style={{
              borderColor: "#e5e0da",
            }}
          />

          <button
            className="py-3 rounded text-white font-semibold transition-all hover:opacity-90"
            style={{
              background: theme.colors.primary,
            }}
          >
            Sign In
          </button>
        </form>

        {/* Back */}
        <button
          onClick={onBack}
          className="mt-4 text-sm transition-colors"
          style={{ color: theme.colors.textSecondary }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}