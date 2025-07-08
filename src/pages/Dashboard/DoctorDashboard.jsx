import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";

const DoctorDashboard = () => {
  return (
    <NakesDashboardLayout>
      <DashboardCard>
        <h2 className="text-black text-2xl font-bold px-4">Dashboard Dokter</h2>
        <div className="p-4">
          <p className="text-gray-700">
            Selamat datang di dashboard dokter. Di sini Anda dapat mengelola
            pasien, dan melakukan berbagai tugas lainnya.
          </p>
        </div>
      </DashboardCard>
    </NakesDashboardLayout>
  );
};

export default DoctorDashboard;
