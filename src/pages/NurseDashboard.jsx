import NakesDashboardLayout from "../layouts/NakesDashboardLayout";

const NurseDashboard = () => {
  return (
    <NakesDashboardLayout>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-black text-2xl px-4">Dashboard Perawat</h2>
          <div className="p-4">
            <p className="text-gray-700">Selamat datang di dashboard perawat. Di sini Anda dapat mengelola pasien, dan melakukan tugas lainnya.</p>
          </div>
      </div>
      
    </NakesDashboardLayout>
  );
};

export default NurseDashboard;
