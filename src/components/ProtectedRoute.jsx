import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = (props) => {
  const { children, roles = null, redirectTo = "/login" } = props;

  const { currentUser, isLoading } = useAuth();

  // Tampilkan loading jika masih mengecek autentikasi
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Jika user belum login, redirect ke halaman login
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  // Jika ada roles yang ditentukan, cek apakah user memiliki role yang diizinkan
  if (roles && roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
