import { useState } from "react";
import PhysioSidebar from "../components/shared/PhysioSidebar";

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
        <h1 className="text-2xl font-bold text-gray-700 capitalize">{activePage}</h1>
      </main>
    </div>
  );
}
