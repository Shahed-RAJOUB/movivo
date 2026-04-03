import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { theme } from "../theme/theme";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // editable fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  // 🔥 Fetch
  useEffect(() => {
    const fetchPatient = async () => {
      const snap = await getDoc(doc(db, "patients", id));

      if (snap.exists()) {
        const data = snap.data();
        setPatient(data);

        setName(data.firstName || "");
        setSurname(data.surname || "");
        setBirthDate(data.birthDate || "");
        setGender(data.gender || "");
      }

      setLoading(false);
    };

    fetchPatient();
  }, [id]);

  // 🔥 Save
  const handleSave = async () => {
    setSaving(true);

    await updateDoc(doc(db, "patients", id), {
      firstName: name,
      surname,
      name: `${surname} ${name}`,
      birthDate,
      gender,
    });

    const updated = {
      ...patient,
      firstName: name,
      surname,
      birthDate,
      gender,
      name: `${surname} ${name}`,
    };

    setPatient(updated);
    setEditMode(false);
    setSaving(false);
  };

  // 🔥 Cancel
  const handleCancel = () => {
    setName(patient.firstName);
    setSurname(patient.surname);
    setBirthDate(patient.birthDate);
    setGender(patient.gender);
    setEditMode(false);
  };

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

          {/* Vorname */}
          <div>
            <span className="text-gray-500">Vorname:</span>{" "}
            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b outline-none ml-2"
              />
            ) : (
              patient.firstName
            )}
          </div>

          {/* Nachname */}
          <div>
            <span className="text-gray-500">Nachname:</span>{" "}
            {editMode ? (
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="border-b outline-none ml-2"
              />
            ) : (
              patient.surname
            )}
          </div>

          {/* Birthdate */}
          <div>
            <span className="text-gray-500">Geburtsdatum:</span>{" "}
            {editMode ? (
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="border-b outline-none ml-2"
              />
            ) : (
              patient.birthDate
            )}
          </div>

          {/* Gender */}
          <div>
            <span className="text-gray-500">Geschlecht:</span>{" "}
            {editMode ? (
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border-b outline-none ml-2"
              >
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
                <option value="other">Divers</option>
              </select>
            ) : (
              patient.gender
            )}
          </div>

          {/* Created By */}
          <div>
            <span className="text-gray-500">Erstellt von:</span>{" "}
            {patient.createdByName}
          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded text-white"
                style={{ background: theme.colors.primary }}
              >
                {saving ? "Speichern..." : "Speichern"}
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded border"
              >
                Abbrechen
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 rounded text-white"
              style={{ background: theme.colors.primary }}
            >
              Bearbeiten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}