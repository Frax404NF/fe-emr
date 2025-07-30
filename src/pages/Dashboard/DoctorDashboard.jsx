import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEncounter } from '../../hooks/useEncounter';
import { calculateEncounterStats } from '../../utils/encounterUtils';
import NakesDashboardLayout from '../../layouts/NakesDashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import NotificationArea from '../../components/ui/NotificationArea';
import { UserPlus, HomeHospital, Journal } from 'iconoir-react';

// Komponen terpisah
const StatCard = ({ title, subtitle, value, borderColor }) => (
  <div className={`bg-white p-6 rounded-xl border-2 ${borderColor} shadow-sm hover:shadow-md transition-all duration-200 text-center`}>
    <div className="text-3xl font-bold text-gray-900 mb-3">{value}</div>
    <div className="text-sm font-medium text-gray-600">{title}</div>
    <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
  </div>
);

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const { encounters, fetchActiveEncounters } = useEncounter();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Fetch encounters saat component mount dengan error handling
  const loadEncounters = useCallback(async () => {
    try {
      await fetchActiveEncounters();
    } catch (error) {
      console.error('Failed to load encounters:', error);
      setNotifications(prev => [
        ...prev,
        {
          type: 'error',
          message:
            error.message === 'Authorization token required'
              ? 'Sesi telah berakhir. Silakan login kembali.'
              : 'Gagal memuat data encounter',
          id: `${Date.now()}-${Math.random()}`,
        },
      ]);

      // If auth error, redirect to login
      if (error.message === 'Authorization token required') {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  }, [fetchActiveEncounters, navigate]);

  useEffect(() => {
    loadEncounters();
  }, [loadEncounters]);

  // Check authentication
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  // Quick Action Handlers dengan navigation
  const handleCreateEncounter = useCallback(() => {
    navigate('/create-encounter');
  }, [navigate]);

  const handleViewEncounters = useCallback(() => {
    navigate('/encounter-dashboard');
  }, [navigate]);

  const handleViewPatients = useCallback(() => {
    navigate('/patient-management');
  }, [navigate]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Get comprehensive statistics for dashboard
  const encounterStats = calculateEncounterStats(encounters);

  return (
    <NakesDashboardLayout>
      <div className="space-y-6">
        {/* Notifications */}
        <NotificationArea
          notifications={notifications}
          setNotifications={setNotifications}
        />

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

        {/* Encounter Statistics */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Statistik Kunjungan IGD
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Menunggu Triage"
                subtitle="Perlu assessment"
                value={encounterStats.triage}
                borderColor="border-amber-200"
              />
              <StatCard
                title="Sedang Ditangani"
                subtitle="Treatment ongoing"
                value={encounterStats.ongoing}
                borderColor="border-blue-200"
              />
              <StatCard
                title="Observasi"
                subtitle="Monitoring pasien"
                value={encounterStats.observation}
                borderColor="border-violet-200"
              />
              <StatCard
                title="Total Aktif"
                subtitle="Semua encounter"
                value={encounterStats.total}
                borderColor="border-emerald-200"
              />
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Aksi Cepat Dokter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleViewPatients}
                className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 group-hover:text-blue-700 transition-all duration-300">
                  <UserPlus className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Manajemen Pasien
                </h3>
                <p className="text-sm text-gray-600">
                  Kelola data pasien dan registrasi
                </p>
              </button>

              <button
                onClick={handleCreateEncounter}
                className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group"
              >
                <div className="text-emerald-600 mb-4 group-hover:scale-110 group-hover:text-emerald-700 transition-all duration-300">
                  <HomeHospital className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mulai Encounter</h3>
                <p className="text-sm text-gray-600">
                  Buat encounter baru untuk pasien
                </p>
              </button>

              <button
                onClick={handleViewEncounters}
                className="bg-white p-6 rounded-xl border-2 border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group"
              >
                <div className="text-violet-600 mb-4 group-hover:scale-110 group-hover:text-violet-700 transition-all duration-300">
                  <Journal className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Dashboard Encounter
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor semua encounter aktif
                </p>
              </button>
            </div>
          </div>
        </DashboardCard>
      </div>
    </NakesDashboardLayout>
  );
};

export default DoctorDashboard;
