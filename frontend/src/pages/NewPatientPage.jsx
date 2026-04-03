import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme/theme";

export default function NewPatientPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (!name || !birthDate) {
      setError("Bitte Name und Geburtsdatum eingeben");
      return;
    }

    try {
      await addDoc(collection(db, "patients"), {
        name,
        birthDate,
        gender,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
      });

      // 🔁 Redirect
      navigate("/patients");
    } catch (err) {
      setError("Fehler beim Speichern");
    }
  };

  return (
    <div className="max-w-xl">

      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: theme.colors.textPrimary }}
      >
        Neuer Patient
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded border"
        />

        {/* Birthdate */}
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="p-3 rounded border"
        />

        {/* Gender */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="p-3 rounded border"
        >
          <option value="">Geschlecht wählen</option>
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
          <option value="other">Divers</option>
        </select>

        {/* Button */}
        <button
          type="submit"
          className="mt-4 py-3 rounded text-white font-semibold"
          style={{ background: theme.colors.primary }}
        >
          Patient speichern
        </button>

      </form>
    </div>
  );
}