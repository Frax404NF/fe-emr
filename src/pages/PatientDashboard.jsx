import PatientDashboardLayout from "../layouts/PatientDashboardLayout";

const PatientDashboard = () => {
  return (
    <PatientDashboardLayout>
      <div class="bg-white p-6 rounded-lg shadow-lg"> 
        <h2 className="text-2xl px-4">Welcome, Pasien Cae!</h2>
          <div className="p-4">
            <p className="text-gray-700">Selamat datang di dashboard pasien. Di sini Anda dapat melihat riwayat rekam medis anda, dan melakukan tugas lainnya.</p>
          </div>
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard;
