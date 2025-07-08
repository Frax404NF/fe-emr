import { useAuth } from "../../hooks/useAuth";
import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";
import PatientManagement from "../../components/PatientManagement";

const NurseDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <NakesDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <DashboardCard>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard Perawat
            </h1>
            <p className="text-gray-600">
              Selamat datang, {currentUser?.staff_name || 'Perawat'}
            </p>
          </div>
        </DashboardCard>

        {/* Patient Management */}
        <PatientManagement />

        {/* Quick Actions for Nurses */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat Perawat</h2>
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

              <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left">
                <div className="text-red-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Triage Assessment</h3>
                <p className="text-sm text-gray-600">Lakukan penilaian triage untuk pasien</p>
              </button>

              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                <div className="text-green-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Vital Signs</h3>
                <p className="text-sm text-gray-600">Catat tanda-tanda vital pasien</p>
              </button>

              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div className="text-purple-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Nursing Notes</h3>
                <p className="text-sm text-gray-600">Tulis catatan keperawatan</p>
              </button>
            </div>
          </div>
        </DashboardCard>

        {/* Patient Queue/Monitoring */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monitoring Pasien</h2>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Fitur Monitoring Akan Tersedia
              </h3>
              <p className="text-gray-600">
                Setelah integrasi dengan modul encounter dan vital signs, 
                Anda akan dapat memonitor status pasien secara real-time di sini.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </NakesDashboardLayout>
  );
};

export default NurseDashboard;
