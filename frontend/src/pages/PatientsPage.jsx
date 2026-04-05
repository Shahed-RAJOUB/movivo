import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { theme } from "../theme/theme";
import Card from "../components/shared/Card";

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
    <div className="px-10 py-8">

      <Card title="Patients" subtitle="Overview">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#a09488] font-semibold border-b border-[#f0e8e0]">
              <td className="py-2">Vorname</td><td>Nachname</td><td>Alter</td>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)}
                className="border-b border-[#f5f0ea] hover:bg-[#faf5f0] cursor-pointer transition-colors">
                <td className="py-2.5 text-[#3d3129]">{p.firstName}</td>
                <td className="text-[#3d3129]">{p.surname}</td>
                <td className="text-[#6b5e54">{calculateAge(p.birthDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>  
  );
}