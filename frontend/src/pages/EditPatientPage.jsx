import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme/theme";

// UI Components
import FormRow from "../components/ui/FormRow";
import Input from "../components/ui/Input";

export default function EditPatientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const therapistName = userData?.name || "Therapeut:in";

  // 🔥 Daten laden
  useEffect(() => {
    const fetchPatient = async () => {
      const snap = await getDoc(doc(db, "patients", id));

      if (snap.exists()) {
        const data = snap.data();

        setName(data.firstName || "");
        setSurname(data.surname || "");
        setBirthDate(data.birthDate || "");
        setGender(data.gender || "");
      }

      setLoading(false);
    };

    fetchPatient();
  }, [id]);

  // 🔥 Speichern
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !surname || !birthDate || !gender) {
      setError("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "patients", id), {
        name: `${surname} ${name}`,
        surname,
        firstName: name,
        birthDate,
        gender,
      });

      navigate(`/patients/${id}`);
    } catch (err) {
      setError("Fehler beim Speichern.");
      setSaving(false);
    }
  };

  if (loading) return <div>Lade Patient...</div>;

  return (
    <div className="max-w-3xl">

      {/* TITLE */}
      <h2
        className="text-2xl font-bold mb-6"
        style={{
          color: theme.colors.primary,
          fontFamily: theme.font.heading,
        }}
      >
        Patient bearbeiten
      </h2>

      {/* CARD */}
      <div
        className="p-8 rounded-2xl"
        style={{
          background: theme.colors.background,
          boxShadow: theme.shadow.card,
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-bold text-sm">Patient</h3>
          <p className="text-xs text-gray-500">Base Data</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {error && (
            <div
              className="text-sm px-4 py-2 rounded"
              style={{
                background: theme.colors.errorBg,
                border: `1px solid ${theme.colors.errorBorder}`,
              }}
            >
              {error}
            </div>
          )}

          <FormRow label="Nachname" required>
            <Input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </FormRow>

          <FormRow label="Vorname" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormRow>

          <FormRow label="Geburtsdatum" required>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </FormRow>

          <FormRow label="Geschlecht" required>
            <div className="flex gap-2">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-1 rounded-full text-sm border ${
                    gender === g
                      ? "text-white border-none"
                      : "text-gray-500"
                  }`}
                  style={{
                    background:
                      gender === g ? theme.colors.primary : "transparent",
                    borderColor: theme.colors.border,
                  }}
                >
                  {g === "male"
                    ? "Männlich"
                    : g === "female"
                    ? "Weiblich"
                    : "Divers"}
                </button>
              ))}
            </div>
          </FormRow>

          <FormRow label="Behandelnder Therapeut">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-red-400 text-white flex items-center justify-center text-xs font-bold">
                {therapistName[0]}
              </div>
              {therapistName}
            </div>
          </FormRow>

        </form>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full mt-6 py-4 rounded-xl text-white font-bold tracking-wide"
        style={{
          background: theme.colors.primaryGradient,
        }}
      >
        {saving ? "Speichere..." : "Änderungen speichern"}
      </button>

      {/* BACK */}
      <div className="text-center mt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm underline text-gray-500"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}