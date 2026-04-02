import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            const data = snap.exists() ? snap.data() : null; // ✅ FIX

            setUser(firebaseUser);
            setRole(data?.role || null);
            setUserData(data); // ✅ jetzt funktioniert es
            } else {
            setUser(null);
            setRole(null);
            setUserData(null); // 🔥 wichtig (sonst alter state bleibt)
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}