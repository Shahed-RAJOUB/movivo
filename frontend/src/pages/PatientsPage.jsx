import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { theme } from "../theme/theme";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const snapshot = await getDocs(collection(db, "patients"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPatients(data);
    };

    fetchPatients();
  }, []);

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
            className="p-4 rounded-2xl"
            style={{
              background: theme.colors.background,
              boxShadow: theme.shadow.card,
            }}
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">
              Alter: {p.age}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}