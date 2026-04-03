import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { theme } from "../theme/theme";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      const docRef = doc(db, "patients", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setPatient(snap.data());
      }

      setLoading(false);
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div>Lade Patient...</div>;

  if (!patient) return <div>Patient nicht gefunden</div>;

  return (
    <div className="max-w-3xl">
      
      {/* BACK */}
      <button
        onClick={() => navigate("/patients")}
        className="mb-4 text-sm text-gray-500 underline"
      >
        ← Zurück
      </button>

      {/* HEADER */}
      <h1
        className="text-2xl font-bold mb-6"
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.font.heading,
        }}
      >
        {patient.name}
      </h1>

      {/* CARD */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: theme.colors.background,
          boxShadow: theme.shadow.card,
        }}
      >
        <div className="grid gap-4 text-sm">

          <div>
            <span className="text-gray-500">Vorname:</span>{" "}
            {patient.firstName}
          </div>

          <div>
            <span className="text-gray-500">Nachname:</span>{" "}
            {patient.surname}
          </div>

          <div>
            <span className="text-gray-500">Geburtsdatum:</span>{" "}
            {patient.birthDate}
          </div>

          <div>
            <span className="text-gray-500">Geschlecht:</span>{" "}
            {patient.gender}
          </div>

          <div>
            <span className="text-gray-500">Erstellt von:</span>{" "}
            {patient.createdByName}
          </div>

        </div>
      </div>

    </div>
  );
}