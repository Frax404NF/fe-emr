import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { USER_ROLES, ROUTES } from "./constants";

// Page Components
import { AdminDashboard, DoctorDashboard, NurseDashboard, PatientDashboard } from "./pages/Dashboard";
import { InpatientDetailPatient, PatientVisitDetail } from "./pages/Patient";
import { LoginPage, RegisterPage } from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MainPage from "./pages/MainPage";

// Styles
import "./index.css";

/**
 * AppRoutes Component
 *
 * Mendefinisikan semua rute dalam aplikasi dengan proteksi yang sesuai.
 * Menggunakan ProtectedRoute untuk mengontrol akses berdasarkan autentikasi dan role.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Dapat diakses tanpa autentikasi */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Protected Routes - Memerlukan autentikasi */}
      <Route path={ROUTES.HOME} element={ <ProtectedRoute> <MainPage /> </ProtectedRoute> }/>

      {/* Role-based Protected Routes */}
      <Route
        path={ROUTES.DOCTOR_DASHBOARD}
        element={
          <ProtectedRoute roles={[USER_ROLES.DOCTOR]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.NURSE_DASHBOARD}
        element={
          <ProtectedRoute roles={[USER_ROLES.NURSE]}>
            <NurseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.PATIENT_DASHBOARD}
        element={
          <ProtectedRoute roles={[USER_ROLES.PATIENT]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* General Protected Routes */}
      <Route
        path={ROUTES.VISIT_DETAIL}
        element={
          <ProtectedRoute>
            <PatientVisitDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.INPATIENT_DETAIL}
        element={
          <ProtectedRoute>
            <InpatientDetailPatient />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
