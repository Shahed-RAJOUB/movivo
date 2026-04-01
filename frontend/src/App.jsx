import { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LoginOverlay from "./components/shared/LoginOverlay";
import PhysioDashboard from "./pages/PhysioDashboard";
import PatientDashboard from "./pages/PatientDashboard";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const snap = await getDoc(doc(db, "users", uid));
      const fetchedRole = snap.exists() ? snap.data().role : null;
      setUser(userCredential.user);
      setRole(fetchedRole);
      setShowLogin(false);
    } catch (error) {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  }

  if (user && role === "physio") {
    return <PhysioDashboard onLogout={handleLogout} />;
  }

  if (user && role === "patient") {
    return <PatientDashboard onLogout={handleLogout} />;
  }

  // Landing Page + Login Overlay
  return (
    <section className="min-h-screen flex relative overflow-hidden">
      
      <div className={`bg-[#ff5a5a] text-white transition-all duration-700 ${showLogin ? "w-[90%]" : "w-1/2"} min-h-screen flex items-center`}>
        <div className="ml-16 max-w-xl">
          
          <>
            <p className="uppercase tracking-widest mb-6 text-sm">MOTIONINVIVO.</p>
            <h1 className="text-6xl font-bold leading-tight">Screening.<br/>Rehabilitation.</h1>
            
            <div className="mt-10 flex items-center gap-4">
              <div className="w-2 h-12 bg-orange-300" />
              <p className="text-sm">FREE YOUR MIND</p>
            </div>

            {!showLogin && (
              <button 
                onClick={() => setShowLogin(true)} 
                className="mt-10 border border-white px-6 py-3"
              >
                LOGIN
              </button>
            )}

            <div className="mt-16 grid grid-cols-12 gap-2 max-w-xs opacity-60">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white" />
              ))}
            </div>
          </>
          
        </div>
      </div>

      <div className={`bg-gray-100 transition-all duration-700 ${showLogin ? "w-[10%]" : "w-1/2"} min-h-screen flex items-center justify-center`}>
        {!showLogin && (
          <h2 className="text-5xl font-bold text-[#ff5a5a]">SAY HELLO.</h2>
        )}
      </div>


      {showLogin && (
        <LoginOverlay
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
          onBack={() => setShowLogin(false)}
        />
      )}

      <div className="absolute bottom-0 right-0 bg-pink-400 text-white px-10 py-4 text-sm z-20">
        PHYSIOTHERAPY SCREENING AND REPORT
      </div>
    </section>
  );
}