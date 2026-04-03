import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { theme } from "../theme/theme";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const snapshot = await getDocs(collection(db, "patients"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPatients(data);
    };

    fetchPatients();
  }, []);

  // Alter berechnen
  const calculateAge = (birthDate) => {
    if (!birthDate) return "-";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div>
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: theme.colors.textPrimary }}
      >
        Patienten
      </h2>

      <div className="grid gap-4">
        {patients.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/patients/${p.id}`)} // 🔥 NAVIGATION
            className="p-4 rounded-2xl cursor-pointer transition hover:shadow-lg"
            style={{
              background: theme.colors.background,
              boxShadow: theme.shadow.card,
            }}
          >
            <div className="font-semibold">{p.name}</div>

            <div className="text-sm text-gray-500">
              Alter: {calculateAge(p.birthDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}