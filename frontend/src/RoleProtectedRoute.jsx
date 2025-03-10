import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  
  return children;
}
