const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "patients", label: "PATIENTS" },
  { id: "screenings", label: "SCREENINGS" },
  { id: "training", label: "TRAINING" },
  { id: "treatments", label: "TREATMENTS" },
  { id: "reports", label: "REPORTS" },
  { id: "settings", label: "SETTINGS" },
];

export default function PhysioSidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside
      className="w-[260px] min-h-screen flex-shrink-0 flex flex-col py-9"
      style={{ background: "linear-gradient(180deg, #E8594F 0%, #e07060 100%)" }}
    >
      <div className="px-7 mb-12">
        <h1 className="text-white text-lg font-bold tracking-[1.5px]">MOTIONINVIVO.</h1>
      </div>

      <nav className="flex-1">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`px-7 py-3 cursor-pointer text-white text-[13.5px] tracking-wider transition-all
              ${activePage === item.id
                ? "font-semibold border-l-4 border-[#FFD86E] bg-white/[0.08]"
                : "font-normal border-l-4 border-transparent hover:bg-white/[0.04]"
              }`}
          >
            {item.label}
          </div>
        ))}
      </nav>

      <div className="px-7 mt-4">
        <button onClick={onLogout} className="text-white/70 text-sm hover:text-white transition-colors">
          Logout
        </button>
      </div>

      {/* Dot pattern */}
      <div className="px-7 mt-6 opacity-20">
        {[...Array(4)].map((_, r) => (
          <div key={r} className="flex gap-2 mb-1.5">
            {[...Array(14)].map((_, c) => (
              <div key={c} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
