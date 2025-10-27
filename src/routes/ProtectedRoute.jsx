import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const token = Cookies.get("auth_token");
  return token ? children : <Navigate to="/login" replace />;
}
