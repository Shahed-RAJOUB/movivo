const NAV_ITEMS = [
  { id: "home",     label: "MEIN BEREICH" },
  { id: "training", label: "TRAININGSPLAN" },
  { id: "progress", label: "FORTSCHRITT" },
  { id: "tutorials", label: "TUTORIALS" },
  { id: "termine",  label: "TERMINE" },
  { id: "settings", label: "EINSTELLUNGEN" },
];

export default function PatientSidebar({ activePage, setActivePage, onLogout, patientName }) {
  return (
    <aside
      className="w65 min-h-screen shrink-0 flex flex-col py-9"
      style={{ background: "linear-gradient(180deg, #1D9E75 0%, #0F6E56 100%)" }}
    >
      <div className="px-7 mb-3">
        <h1 className="text-white text-lg font-bold tracking-[1.5px]">MOTIONINVIVO.</h1>
      </div>

      {patientName && (
        <div className="px-7 mb-10">
          <div className="flex items-center gap-3 mt-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              {patientName.charAt(0)}
            </div>
            <div>
              <div className="text-white text-[13px] font-medium">{patientName}</div>
              <div className="text-white/50 text-[11px]">Patient</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`px-7 py-3 cursor-pointer text-white text-[13.5px] tracking-wider transition-all
              ${activePage === item.id
                ? "font-semibold border-l-4 border-[#FFD86E] bg-white/8"
                : "font-normal border-l-4 border-transparent hover:bg-white/4"
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
