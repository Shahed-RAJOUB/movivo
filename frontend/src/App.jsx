import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import LoginOverlay from "./components/shared/LoginOverlay";
import PhysioDashboard from "./pages/PhysioDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { theme } from "./theme/theme";

export default function App() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ─── AUTH STATE ───
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const fetchedRole = snap.exists() ? snap.data().role : null;
        setUser(firebaseUser);
        setRole(fetchedRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ─── LOGIN ───
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;
      const snap = await getDoc(doc(db, "users", uid));
      const fetchedRole = snap.exists() ? snap.data().role : null;

      setUser(userCredential.user);
      setRole(fetchedRole);
      setShowLogin(false);

      // 👉 redirect nach login
      if (fetchedRole === "physio") navigate("/home");
      if (fetchedRole === "patient") navigate("/patient");
    } catch (error) {
      alert("Login failed");
    }
  };

  // ─── LOGOUT ───
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    navigate("/");
  };

  if (authLoading) return null;

  return (
    <Routes>

      {/* ─── LANDING PAGE ─── */}
      <Route
        path="/"
        element={
          <section
            className="min-h-screen flex relative overflow-hidden"
            style={{ fontFamily: theme.font.body }}
          >
            {/* LEFT */}
            <div
              className={`text-white transition-all duration-700 ${
                showLogin ? "w-[90%]" : "w-1/2"
              } min-h-screen flex items-center`}
              style={{ background: theme.colors.primary }}
            >
              <div className="ml-16 max-w-xl">
                <p
                  className="uppercase tracking-widest mb-6 text-sm"
                  style={{
                    fontFamily: theme.font.brand,
                    fontWeight: 700,
                  }}
                >
                  MOTIONINVIVO.
                </p>

                <h1
                  className="text-6xl font-bold leading-tight"
                  style={{ fontFamily: theme.font.heading }}
                >
                  Screening.<br />Rehabilitation.
                </h1>

                <div className="mt-10 flex items-center gap-4">
                  <div
                    className="w-2 h-12"
                    style={{ background: "#FFD86E" }}
                  />
                  <p className="text-sm">FREE YOUR MIND</p>
                </div>

                {!showLogin && (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="mt-10 px-6 py-3 border transition-all hover:bg-white hover:text-black"
                  >
                    LOGIN
                  </button>
                )}

                <div className="mt-16 grid grid-cols-12 gap-2 max-w-xs opacity-60">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white" />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className={`transition-all duration-700 ${
                showLogin ? "w-[10%]" : "w-1/2"
              } min-h-screen flex items-center justify-center`}
              style={{ background: "#f5f3f1" }}
            >
              {!showLogin && (
                <h2
                  className="text-5xl font-bold"
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.font.heading,
                  }}
                >
                  SAY HELLO.
                </h2>
              )}
            </div>

            {/* LOGIN */}
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

            {/* FOOTER */}
            <div
              className="absolute bottom-0 right-0 text-white px-10 py-4 text-sm z-20"
              style={{ background: theme.colors.primary }}
            >
              PHYSIOTHERAPY SCREENING AND REPORT
            </div>
          </section>
        }
      />

      {/* ─── PHYSIO PROTECTED ─── */}
      <Route
        path="/*"
        element={
          <ProtectedRoute user={user} role={role} allowedRole="physio">
            <PhysioDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* ─── PATIENT PROTECTED ─── */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute user={user} role={role} allowedRole="patient">
            <PatientDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* ─── FALLBACK ─── */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}