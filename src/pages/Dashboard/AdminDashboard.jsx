import { useAuth } from '../../hooks/useAuth';
import NakesDashboardLayout from '../../layouts/NakesDashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';

const AdminDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <NakesDashboardLayout>
      <DashboardCard>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Selamat datang, {currentUser?.staff_name} (ADMIN)</p>
        {/* Konten admin */}
      </DashboardCard>
    </NakesDashboardLayout>
  );
};

export default AdminDashboard;
