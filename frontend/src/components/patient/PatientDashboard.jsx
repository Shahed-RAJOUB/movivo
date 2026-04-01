import { useState } from "react";
import PatientSidebar from "../shared/PatientSidebar";
import PlaceholderPage from "../shared/PlaceholderPage";
import PatientHomePage from "./PatientHomePage";

export default function PatientDashboard({ onLogout, userName }) {
  const [activePage, setActivePage] = useState("home");

  const PAGES = {
    training:  { title: "Trainingsplan",   cardTitle: "Mein Plan",       message: "Dein Trainingsplan wird hier angezeigt — coming soon." },
    progress:  { title: "Fortschritt",     cardTitle: "Mein Fortschritt", message: "Detaillierter Therapie-Fortschritt — coming soon." },
    tutorials: { title: "Tutorials",       cardTitle: "Video-Bibliothek", message: "Tutorials und Übungsanleitungen — coming soon." },
    termine:   { title: "Termine",         cardTitle: "Meine Termine",    message: "Terminübersicht — coming soon." },
    settings:  { title: "Einstellungen",   cardTitle: "Mein Konto",       message: "Kontoeinstellungen — coming soon." },
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(180deg, #f0faf5 0%, #e8f5ee 50%, #d4efe0 100%)",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
        rel="stylesheet"
      />

      <PatientSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        patientName={userName}
      />

      <main className="flex-1 p-8 overflow-auto">
        {activePage === "home" && <PatientHomePage userName={userName} />}

        {Object.entries(PAGES).map(([id, p]) =>
          activePage === id ? (
            <PlaceholderPage key={id} title={p.title} cardTitle={p.cardTitle} message={p.message} />
          ) : null
        )}
      </main>
    </div>
  );
}
