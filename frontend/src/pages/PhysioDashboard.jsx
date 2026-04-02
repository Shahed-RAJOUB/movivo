import { useState } from "react";
import PhysioSidebar from "../components/shared/PhysioSidebar";
import PhysioHomePage from "../components/physio/PhysioHomePage";

export default function PhysioDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="flex min-h-screen">
      <PhysioSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
      />
      <main className="flex-1 bg-gray-50 p-10">
        
        {activePage === "home" && (
          <PhysioHomePage
            userName="Lukas" // später aus Firebase
            onNavigate={setActivePage}
            onStartScreening={() => setActivePage("screenings")}
          />
        )}

        {activePage === "patients" && <div>Patienten Seite</div>}
        {activePage === "screenings" && <div>Screenings Seite</div>}
      </main>
    </div>
  );
}
