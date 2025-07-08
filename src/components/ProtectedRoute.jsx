import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";

/**
 * ProtectedRoute Component
 * 
 * Komponen untuk melindungi rute yang memerlukan autentikasi dan otorisasi.
 * Digunakan untuk mengontrol akses berdasarkan status login dan role pengguna.
 * Enhanced dengan better loading UI dan extensible props pattern.
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Komponen yang akan di-render jika akses diizinkan
 * @param {string[]} [props.roles] - Array role yang diizinkan mengakses rute ini
 * @param {string} [props.redirectTo=ROUTES.LOGIN] - Rute tujuan redirect jika akses ditolak
 * 
 * @example
 * // Proteksi route untuk semua user yang sudah login
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Proteksi route khusus untuk admin
 * <ProtectedRoute roles={["ADMIN"]}>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
const ProtectedRoute = (props) => {
  const { children, roles = null, redirectTo = ROUTES.LOGIN } = props;

  const { currentUser, isLoading } = useAuth();

  // Tampilkan loading jika masih mengecek autentikasi
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
