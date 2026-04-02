import { theme } from "../../theme/theme";
import QuickActionCard from "../ui/QuickActionCard";

export default function PhysioHomePage({ userName, onNavigate, onStartScreening }) {
  const today = new Date();
  const greeting =
    today.getHours() < 12
      ? "Guten Morgen"
      : today.getHours() < 18
      ? "Guten Tag"
      : "Guten Abend";

  return (
    <div className="p-6" style={{ fontFamily: theme.font.body }}>
      
      {/* ─── HEADER ─── */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.font.heading,
          }}
        >
          {greeting}, {userName || "Therapeut:in"}
        </h1>

        <p
          className="text-sm mt-1"
          style={{ color: theme.colors.textSecondary }}
        >
          Bereit für deinen nächsten Patienten?
        </p>
      </div>

      {/* ─── QUICK ACTIONS ─── */}
      <h3
        className="text-base font-bold mb-4"
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.font.heading,
        }}
      >
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <QuickActionCard
          title="Neue Patientin"
          description="Patient:in anlegen & speichern"
          icon="+"
          gradient={theme.colors.primaryGradient}
          onClick={() => onNavigate?.("new-patient")}
        />

        <QuickActionCard
          title="Neues Screening"
          description="FMS Screen starten"
          icon="◉"
          gradient={theme.colors.successGradient}
          onClick={() => onStartScreening?.()}
        />

        <QuickActionCard
          title="Patienten"
          description="Übersicht & Verlauf"
          icon="≡"
          gradient={theme.colors.infoGradient}
          onClick={() => onNavigate?.("patients")}
        />

      </div>

    </div>
  );
}