import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const app = initializeApp({
  apiKey: "demo-key",
  authDomain: "localhost",
  projectId: "demo-project",
});

export const auth = getAuth(app);
export const db = getFirestore(app);

connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);
