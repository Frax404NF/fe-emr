import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEncounter } from "../../hooks/useEncounter";
import { calculateEncounterStats } from "../../utils/encounterUtils";
import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";
import NotificationArea from "../../components/ui/NotificationArea";

// Komponen terpisah
const StatCard = ({ title, subtitle, value, bgColor, circleColor }) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 ${circleColor} rounded-full flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">{value}</span>
        </div>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
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
      console.error("Failed to load encounters:", error);
      setNotifications((prev) => [
        ...prev,
        {
          type: "error",
          message: error.message === "Authorization token required" 
            ? "Sesi telah berakhir. Silakan login kembali."
            : "Gagal memuat data encounter",
          id: `${Date.now()}-${Math.random()}`,
        },
      ]);
      
      // If auth error, redirect to login
      if (error.message === "Authorization token required") {
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  }, [fetchActiveEncounters, navigate]);

  useEffect(() => {
    loadEncounters();
  }, [loadEncounters]);

  // Check authentication
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  // Quick Action Handlers dengan navigation
  const handleCreateEncounter = useCallback(() => {
    navigate("/create-encounter");
  }, [navigate]);

  const handleViewEncounters = useCallback(() => {
    navigate("/encounter-dashboard");
  }, [navigate]);

  const handleViewPatients = useCallback(() => {
    navigate("/patient-management");
  }, [navigate]);


  // Auto-dismiss notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
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
              Selamat datang, Dr. {currentUser?.staff_name || "Dokter"}
            </p>
          </div>
        </DashboardCard>

        {/* Encounter Statistics */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Statistik Kunjungan IGD
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Menunggu Triage"
                subtitle="Perlu assessment"
                value={encounterStats.triage}
                bgColor="bg-yellow-50"
                circleColor="bg-yellow-500"
              />
              <StatCard
                title="Sedang Ditangani"
                subtitle="Treatment ongoing"
                value={encounterStats.ongoing}
                bgColor="bg-blue-50"
                circleColor="bg-blue-500"
              />
              <StatCard
                title="Observasi"
                subtitle="Monitoring pasien"
                value={encounterStats.observation}
                bgColor="bg-purple-50"
                circleColor="bg-purple-500"
              />
              <StatCard
                title="Total Aktif"
                subtitle="Semua encounter"
                value={encounterStats.total}
                bgColor="bg-green-50"
                circleColor="bg-green-500"
              />
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Aksi Cepat Dokter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleViewPatients}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="text-blue-600 mb-2">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">
                  Manajemen Pasien
                </h3>
                <p className="text-sm text-gray-600">
                  Kelola data pasien dan registrasi
                </p>
              </button>

              <button
                onClick={handleCreateEncounter}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <div className="text-green-600 mb-2">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Mulai Encounter</h3>
                <p className="text-sm text-gray-600">
                  Buat encounter baru untuk pasien
                </p>
              </button>

              <button
                onClick={handleViewEncounters}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <div className="text-purple-600 mb-2">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">
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
