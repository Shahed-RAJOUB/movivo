import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, allowedRole, children }) {
  // nicht eingeloggt
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // falsche Rolle
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}