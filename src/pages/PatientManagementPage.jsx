import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NakesDashboardLayout from '../layouts/NakesDashboardLayout';
import PatientManagement from '../components/PatientManagement';
import PatientFormModal from '../components/PatientFormModal';

const PatientManagementPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBackToDashboard = () => {
    // Navigate back to appropriate dashboard based on user role
    if (currentUser?.role === 'DOCTOR') {
      navigate('/dokter-view', { replace: true });
    } else if (currentUser?.role === 'NURSE') {
      navigate('/nurse-view', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleAddNewPatient = () => {
    setShowPatientModal(true);
  };

  const handleModalClose = () => {
    setShowPatientModal(false);
  };

  const handlePatientCreated = newPatient => {
    // Force refresh of the patient list by updating key
    setRefreshKey(prev => prev + 1);
    console.log('New patient created:', newPatient);
  };

  return (
    <NakesDashboardLayout>
      <div className="space-y-6">
        {/* Navigation Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Tombol kembali */}
              <button
                onClick={handleBackToDashboard}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Kembali ke halaman utama"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Kembali ke halaman utama
              </button>
            </div>

            <button
              onClick={handleAddNewPatient}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tambah Pasien Baru
            </button>
          </div>
        </div>

        {/* Page Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pasien</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data pasien, pencarian, dan registrasi pasien baru
          </p>
        </div>

        {/* Patient Management Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <PatientManagement key={refreshKey} />
        </div>

        {/* Patient Form Modal */}
        <PatientFormModal
          isOpen={showPatientModal}
          onClose={handleModalClose}
          onSuccess={handlePatientCreated}
        />
      </div>
    </NakesDashboardLayout>
  );
};

export default PatientManagementPage;
