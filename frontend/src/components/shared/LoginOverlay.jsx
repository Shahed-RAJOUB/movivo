export default function LoginOverlay({ email, setEmail, password, setPassword, onLogin, onBack }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="w-full max-w-sm bg-white p-8 shadow-2xl rounded animate-fadeIn">
        <h2 className="text-3xl font-bold text-[#ff5a5a] mb-6 text-center">Login</h2>
        <form onSubmit={onLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} className="border p-3 rounded" />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="border p-3 rounded" />
          <button className="bg-[#ff5a5a] text-white py-3 rounded">Sign In</button>
        </form>
        <button onClick={onBack} className="mt-4 text-sm text-gray-500">← Back</button>
      </div>
    </div>
  );
}
