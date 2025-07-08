import { useAuth } from "../../hooks/useAuth";
import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";
import PatientManagement from "../../components/PatientManagement";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <NakesDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <DashboardCard>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard Dokter
            </h1>
            <p className="text-gray-600">
              Selamat datang, Dr. {currentUser?.staff_name || 'Dokter'}
            </p>
          </div>
        </DashboardCard>

        {/* Patient Management */}
        <PatientManagement />

        {/* Quick Actions */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <div className="text-blue-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Registrasi Pasien</h3>
                <p className="text-sm text-gray-600">Daftarkan pasien baru ke sistem</p>
              </button>

              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                <div className="text-green-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Mulai Encounter</h3>
                <p className="text-sm text-gray-600">Buat encounter baru untuk pasien</p>
              </button>

              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div className="text-purple-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Riwayat Medis</h3>
                <p className="text-sm text-gray-600">Lihat riwayat medis pasien</p>
              </button>

              <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left">
                <div className="text-red-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Kasus Darurat</h3>
                <p className="text-sm text-gray-600">Tangani kasus darurat IGD</p>
              </button>
            </div>
          </div>
        </DashboardCard>
      </div>
    </NakesDashboardLayout>
  );
};

export default DoctorDashboard;
