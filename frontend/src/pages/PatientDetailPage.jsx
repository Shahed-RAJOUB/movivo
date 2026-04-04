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
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  // ─── FETCH ───
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

  // ─── AUTO SAVE ───
  const saveField = async (field, value) => {
    setSaving(true);

    const updatedData = {
      firstName: field === "firstName" ? value : name,
      surname: field === "surname" ? value : surname,
      birthDate: field === "birthDate" ? value : birthDate,
      gender: field === "gender" ? value : gender,
    };

    const fullName = `${updatedData.surname} ${updatedData.firstName}`;

    await updateDoc(doc(db, "patients", id), {
      ...updatedData,
      name: fullName,
    });

    setPatient({
      ...patient,
      ...updatedData,
      name: fullName,
    });

    setSaving(false);
  };

  // ─── INLINE EDIT ───
  const InlineEdit = ({ value, onChange, field, type = "text" }) => {
    const isEditing = editingField === field;

    return isEditing ? (
      <input
        type={type}
        value={value}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          saveField(field, e.target.value); // 🔥 auto save
          setEditingField(null);
        }}
        className="ml-2 border-b outline-none"
      />
    ) : (
      <span
        onClick={() => setEditingField(field)}
        className="ml-2 cursor-pointer hover:bg-gray-100 px-1 rounded"
      >
        {value || "—"}
      </span>
    );
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
        {surname} {name}
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
            <span className="text-gray-500">Vorname:</span>
            <InlineEdit
              field="firstName"
              value={name}
              onChange={setName}
            />
          </div>

          <div>
            <span className="text-gray-500">Nachname:</span>
            <InlineEdit
              field="surname"
              value={surname}
              onChange={setSurname}
            />
          </div>

          <div>
            <span className="text-gray-500">Geburtsdatum:</span>
            <InlineEdit
              field="birthDate"
              value={birthDate}
              onChange={setBirthDate}
              type="date"
            />
          </div>

          <div>
            <span className="text-gray-500">Geschlecht:</span>

            {editingField === "gender" ? (
              <select
                value={gender}
                autoFocus
                onChange={(e) => setGender(e.target.value)}
                onBlur={(e) => {
                  saveField("gender", e.target.value);
                  setEditingField(null);
                }}
                className="ml-2 border-b outline-none"
              >
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
                <option value="other">Divers</option>
              </select>
            ) : (
              <span
                onClick={() => setEditingField("gender")}
                className="ml-2 cursor-pointer hover:bg-gray-100 px-1 rounded"
              >
                {gender || "—"}
              </span>
            )}
          </div>

          <div>
            <span className="text-gray-500">Erstellt von:</span>{" "}
            {patient.createdByName}
          </div>

        </div>

        {/* SAVE STATUS */}
        {saving && (
          <div className="mt-4 text-sm text-gray-500">
            Speichert...
          </div>
        )}
      </div>
    </div>
  );
}