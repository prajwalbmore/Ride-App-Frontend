import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <Link to="/" className="font-bold text-lg">
        RideApp
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {user.role === "driver" && <Link to="/driver">Dashboard</Link>}
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
