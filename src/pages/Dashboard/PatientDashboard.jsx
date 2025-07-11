import PatientDashboardLayout from '../../layouts/PatientDashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';

const PatientDashboard = () => {
  return (
    <PatientDashboardLayout>
      <DashboardCard>
        <h2 className="text-2xl px-4">Welcome, Pasien C!</h2>
        <div className="p-4">
          <p className="text-gray-700">
            Selamat datang di dashboard pasien. Di sini Anda dapat melihat
            riwayat rekam medis anda, dan melakukan tugas lainnya.
          </p>
        </div>
        <div className="p-4">
          <a
            href="/visit-detail"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Lihat Detail Kunjungan Terbaru Anda
          </a>
        </div>
      </DashboardCard>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
