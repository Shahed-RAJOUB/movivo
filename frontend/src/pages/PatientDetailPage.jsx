import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { theme } from "../theme/theme";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);

  // editable fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  // UX states
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [status, setStatus] = useState("");
  const [lastSavedData, setLastSavedData] = useState(null);

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // ─── DEBOUNCE SAVE ───
  const debouncedSave = (field, value) => {
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(async () => {
      setStatus("saving");

      const updatedData = {
        firstName: field === "firstName" ? value : name,
        surname: field === "surname" ? value : surname,
        birthDate: field === "birthDate" ? value : birthDate,
        gender: field === "gender" ? value : gender,
      };

      const fullName = `${updatedData.surname} ${updatedData.firstName}`;

      // backup for undo
      setLastSavedData({
        firstName: patient.firstName,
        surname: patient.surname,
        birthDate: patient.birthDate,
        gender: patient.gender,
      });

      await updateDoc(doc(db, "patients", id), {
        ...updatedData,
        name: fullName,
      });

      setPatient({
        ...patient,
        ...updatedData,
        name: fullName,
      });

      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    }, 500);

    setSaveTimeout(timeout);
  };

  // ─── UNDO ───
  const handleUndo = async () => {
    if (!lastSavedData) return;

    setStatus("saving");

    const fullName = `${lastSavedData.surname} ${lastSavedData.firstName}`;

    await updateDoc(doc(db, "patients", id), {
      ...lastSavedData,
      name: fullName,
    });

    setPatient({
      ...patient,
      ...lastSavedData,
      name: fullName,
    });

    setName(lastSavedData.firstName);
    setSurname(lastSavedData.surname);
    setBirthDate(lastSavedData.birthDate);
    setGender(lastSavedData.gender);

    setStatus("saved");
  };

  // ─── DELETE ───
  const handleDelete = async () => {
    setDeleting(true);
    await deleteDoc(doc(db, "patients", id));
    navigate("/patients");
  };

  // ─── INLINE EDIT ───
  const InlineEdit = ({ value, onChange, field, type = "text" }) => {
    const isEditing = editingField === field;

    return isEditing ? (
      <input
        type={type}
        value={value}
        autoFocus
        onChange={(e) => {
          onChange(e.target.value);
          debouncedSave(field, e.target.value);
        }}
        onBlur={() => setEditingField(null)}
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
            <InlineEdit field="firstName" value={name} onChange={setName} />
          </div>

          <div>
            <span className="text-gray-500">Nachname:</span>
            <InlineEdit field="surname" value={surname} onChange={setSurname} />
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
                onChange={(e) => {
                  setGender(e.target.value);
                  debouncedSave("gender", e.target.value);
                }}
                onBlur={() => setEditingField(null)}
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

        {/* STATUS */}
        <div className="mt-4 text-sm text-gray-500 flex items-center gap-3">
          {status === "saving" && <span>Speichert...</span>}
          {status === "saved" && <span>Gespeichert ✓</span>}

          {status === "saved" && (
            <button onClick={handleUndo} className="underline text-xs">
              Rückgängig
            </button>
          )}
        </div>

        {/* DELETE BUTTON */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-6 text-sm text-red-500 hover:underline"
        >
          Patient löschen
        </button>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />

          {/* MODAL */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl z-10">

            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Patient löschen?
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Möchtest du den Patienten{" "}
              <span className="font-semibold">{patient.name}</span> wirklich löschen?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded border"
              >
                Abbrechen
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded text-white"
                style={{ background: deleting ? "#999" : "#e53935" }}
              >
                {deleting ? "Lösche..." : "Endgültig löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}