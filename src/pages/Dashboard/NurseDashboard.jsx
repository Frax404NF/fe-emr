import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";

const NurseDashboard = () => {
  return (
    <NakesDashboardLayout>
      <DashboardCard>
        <h2 className="text-black text-2xl px-4">Dashboard Perawat</h2>
        <div className="p-4">
          <p className="text-gray-700">
            Selamat datang di dashboard perawat. Di sini Anda dapat mengelola pasien, dan melakukan tugas lainnya.
          </p>
        </div>
      </DashboardCard>
    </NakesDashboardLayout>
  );
};

export default NurseDashboard;
