import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import {
  AdminDashboard,
  DoctorDashboard,
  NurseDashboard,
  PatientDashboard,
} from './pages/Dashboard';
import { LoginPage, RegisterPage } from './pages/Auth';
import NotFound from './pages/NotFound';
import MainPage from './pages/MainPage';

// Encounter Pages
import EncounterDashboard from './pages/Encounter/EncounterDashboard';
import CreateEncounterPage from './pages/Encounter/CreateEncounterPage';
import EncounterDetailPage from './pages/Encounter/EncounterDetailPage';

// Patient Management Pages
import PatientManagementPage from './pages/Patient/PatientManagementPage';

// Styles
import './index.css';

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Memerlukan autentikasi */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {' '}
            <MainPage />{' '}
          </ProtectedRoute>
        }
      />

      {/* Role-based Protected Routes */}
      <Route
        path="/dokter-view"
        element={
          <ProtectedRoute roles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nurse-view"
        element={
          <ProtectedRoute roles={['NURSE']}>
            <NurseDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-view"
        element={
          <ProtectedRoute roles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-view"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Encounter Management Routes - Accessible by DOCTOR and NURSE */}
      <Route
        path="/encounter-dashboard"
        element={
          <ProtectedRoute roles={['DOCTOR', 'NURSE']}>
            <EncounterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-encounter"
        element={
          <ProtectedRoute roles={['DOCTOR', 'NURSE']}>
            <CreateEncounterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/encounters/:encounterId"
        element={
          <ProtectedRoute roles={['DOCTOR', 'NURSE']}>
            <EncounterDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Patient Management Route - Accessible  */}
      <Route
        path="/patient-management"
        element={
          <ProtectedRoute roles={['DOCTOR', 'NURSE']}>
            <PatientManagementPage />
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
