import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { theme } from "../theme/theme";
import Card from "../components/shared/Card";
import PatientHistory from "../components/patient/PatientHistory";


export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const [saveTimeout, setSaveTimeout] = useState(null);
  const [status, setStatus] = useState("");
  const [lastSavedData, setLastSavedData] = useState(null);

  const [deleting, setDeleting] = useState(false);
  
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "history"


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



  // ─── AGE ───
  const calculateAge = (birthDate) => {
    if (!birthDate) return "-";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  };

  const initials = `${name?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();

  // ─── SAVE ───
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

      setPatient({ ...patient, ...updatedData, name: fullName });

      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    }, 500);

    setSaveTimeout(timeout);
  };

  const handleUndo = async () => {
    if (!lastSavedData) return;

    const fullName = `${lastSavedData.surname} ${lastSavedData.firstName}`;

    await updateDoc(doc(db, "patients", id), {
      ...lastSavedData,
      name: fullName,
    });

    setPatient({ ...patient, ...lastSavedData, name: fullName });

    setName(lastSavedData.firstName);
    setSurname(lastSavedData.surname);
    setBirthDate(lastSavedData.birthDate);
    setGender(lastSavedData.gender);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteDoc(doc(db, "patients", id));
    navigate("/patients");
  };

  // ─── INLINE EDIT CLEAN ───
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
        className="w-full px-1 border-b border-[#e8e0da] bg-transparent outline-none text-[#3d3129] focus:border-[#E8594F]"
      />
    ) : (
      <span
        onClick={() => setEditingField(field)}
        className="block w-full px-1 py-1 cursor-pointer rounded hover:bg-[#faf5f0]"
      >
        {value || <span className="text-[#a09488] italic">Nicht gesetzt</span>}
      </span>
    );
  };

  if (loading) return <div>Lade Patient...</div>;
  if (!patient) return <div>Patient nicht gefunden</div>;

  return (

  <div className="flex flex-col">

    {/* ─── HEADER ─── */}
    <div className="sticky top-16 z-10 px-10 pt-4 pb-2 bg-white border-b border-[#f0e8e0]">

      <div className="flex items-center justify-between pb-3">

        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ background: theme.colors.primaryGradient }}
          >
            {initials}
          </div>

          {/* Name + Meta */}
          <div>
            <div className="text-[20px] font-semibold tracking-tight text-[#3d3129]">
              {name} {surname}
            </div>

            <div className="text-[13px] text-[#b0a49a]">
              {calculateAge(birthDate)} Jahre
              {gender && ` • ${
                gender === "male"
                  ? "Männlich"
                  : gender === "female"
                  ? "Weiblich"
                  : "Divers"
              }`}
            </div>
          </div>

        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="text-[13px] text-red-500 hover:underline"
        >
          Löschen
        </button>

      </div>

      {/* ─── NAVIGATION ─── */}
      <div className="flex gap-6 text-[13px] mt-2">

        <div 
          onClick={() => setActiveTab("overview")}
          className={`relative pb-3 cursor-pointer transition-colors ${activeTab === "overview" ? "font-medium text-[#3d3129]" : "text-[#b0a49a] hover:text-[#3d3129]"}`}
        >
          Übersicht
          {activeTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8594F]" />}
        </div>

        <div 
          onClick={() => setActiveTab("history")}
          className={`relative pb-3 cursor-pointer transition-colors ${activeTab === "history" ? "font-medium text-[#3d3129]" : "text-[#b0a49a] hover:text-[#3d3129]"}`}
        >
          Verlauf
          {activeTab === "history" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8594F]" />}
        </div>

      </div>

    </div>

    {/* ─── CONTENT ─── */}
    <div className="px-10 py-8">

      {activeTab === "overview" ? (
        <div className="grid grid-cols-[1fr_360px] gap-10">

          {/* ─── LEFT: STAMMDATEN ─── */}
          <Card title="Stammdaten">
            {/* ... Stammdaten content ... */}
            <div className="text-xs text-[#b0a49a] mb-4 uppercase tracking-wide">
              Basisdaten
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">

              <div className="text-[#b0a49a]">Vorname</div>
              <InlineEdit field="firstName" value={name} onChange={setName} />

              <div className="text-[#b0a49a]">Nachname</div>
              <InlineEdit field="surname" value={surname} onChange={setSurname} />

              <div className="text-[#b0a49a]">Geburtsdatum</div>
              <InlineEdit
                field="birthDate"
                value={birthDate}
                onChange={setBirthDate}
                type="date"
              />

              <div className="text-[#b0a49a]">Alter</div>
              <div className="text-[#3d3129]">
                {calculateAge(birthDate)} Jahre
              </div>

              <div className="text-[#b0a49a]">Geschlecht</div>
              <InlineEdit
                field="gender"
                value={
                  gender === "male"
                    ? "Männlich"
                    : gender === "female"
                    ? "Weiblich"
                    : gender === "other"
                    ? "Divers"
                    : ""
                }
                onChange={(val) => {
                  const map = {
                    "Männlich": "male",
                    "Weiblich": "female",
                    "Divers": "other",
                  };
                  setGender(map[val] || val);
                }}
              />

            </div>

            <div className="border-t border-[#f0e8e0] my-6" />

            <div className="text-xs text-[#b0a49a] mb-4 uppercase tracking-wide">
              System
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">

              <div className="text-[#b0a49a]">Therapeut</div>
              <div className="text-[#3d3129]">
                {patient.createdByName || "-"}
              </div>

              <div className="text-[#b0a49a]">Erstellt am</div>
              <div className="text-[#3d3129]">
                {patient.createdAt?.toDate
                  ? patient.createdAt.toDate().toLocaleDateString()
                  : "-"}
              </div>

            </div>

          </Card>

          {/* ─── RIGHT: MOCK DASHBOARD ─── */}
          <div className="flex flex-col gap-6">

            {/* SCORE */}
            <Card title="Aktueller Status">

              <div className="text-3xl font-bold text-[#3d3129]">
                16 / 21
              </div>

              <div className="text-sm text-[#b0a49a] mt-1">
                letzter FMS Score
              </div>

              <div className="mt-4 h-2 bg-[#f5f0ea] rounded-full overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: "76%",
                    background: theme.colors.primaryGradient,
                  }}
                />
              </div>

              <div className="text-xs text-green-500 mt-2">
                +2 Verbesserung
              </div>

            </Card>

            {/* SESSIONS */}
            <Card title="Behandlung">

              <div className="flex justify-between items-center">

                <div>
                  <div className="text-2xl font-bold text-[#3d3129]">
                    12
                  </div>
                  <div className="text-sm text-[#b0a49a]">
                    Sessions gesamt
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-[#3d3129]">
                    2 / Woche
                  </div>
                  <div className="text-xs text-[#b0a49a]">
                    Frequenz
                  </div>
                </div>

              </div>

            </Card>

            {/* NEXT SESSION */}
            <Card title="Nächster Termin">

              <div className="text-lg font-semibold text-[#3d3129]">
                12. April 2026
              </div>

              <div className="text-sm text-[#b0a49a] mt-1">
                09:30 Uhr • Praxis
              </div>

              <div className="mt-3 text-xs text-[#b0a49a]">
                geplant vor 3 Tagen
              </div>

            </Card>

            {/* SCREENINGS */}
            <Card title="Letzte Screenings">

              <div className="flex flex-col gap-3 text-sm">

                <div className="flex justify-between">
                  <span>20.03.2026</span>
                  <span className="font-medium">16 / 21</span>
                </div>

                <div className="flex justify-between">
                  <span>12.03.2026</span>
                  <span className="font-medium">14 / 21</span>
                </div>

                <div className="flex justify-between">
                  <span>01.03.2026</span>
                  <span className="font-medium">13 / 21</span>
                </div>

              </div>

            </Card>

          </div>

        </div>
      ) : (
        <PatientHistory patient={patient} />
      )}


    </div>

  </div>

  );
}