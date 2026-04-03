import PhysioSidebar from "../components/shared/PhysioSidebar";
import PhysioHomePage from "../components/physio/PhysioHomePage";
import Topbar from "../components/layout/Topbar"
import PatientsPage from "./PatientsPage";
import NewPatientPage from "./NewPatientPage";

import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

export default function PhysioDashboard({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">

      {/* ─── SIDEBAR ─── */}
      <PhysioSidebar
        onNavigate={navigate}
        onLogout={onLogout}
      />

      {/* ─── RIGHT SIDE ─── */}
      <div className="flex-1 flex flex-col">

        {/* ─── TOPBAR ─── */}
        <Topbar />

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 bg-gray-50 p-10">
          <Routes>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Home */}
            <Route
              path="/home"
              element={
                <PhysioHomePage
                  onNavigate={navigate}
                  onStartScreening={() => navigate("/screenings")}
                />
              }
            />

            {/* Patients */}
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/new-patient" element={<NewPatientPage />} />

            {/* Screenings */}
            <Route path="/screenings" element={<div>Screenings Seite</div>} />

            {/* Future Routes */}
            <Route path="/training" element={<div>Training Seite</div>} />
            <Route path="/treatments" element={<div>Treatments Seite</div>} />
            <Route path="/reports" element={<div>Reports Seite</div>} />
            <Route path="/settings" element={<div>Settings Seite</div>} />

          </Routes>
        </main>

      </div>
    </div>
  );
}