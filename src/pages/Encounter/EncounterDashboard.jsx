import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEncounter } from '../../hooks/useEncounter';
import Navbar from '../../components/ui/Navbar';
import DashboardCard from '../../components/ui/DashboardCard';

const EncounterDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { encounters, loading, error, fetchActiveEncounters, clearError } =
    useEncounter();

  const [selectedStatus, setSelectedStatus] = useState('');

  const handleBackToDashboard = () => {
    // Navigate back to appropriate dashboard based on user role
    if (currentUser?.role === 'DOCTOR') {
      navigate('/dokter-view', { replace: true });
    } else if (currentUser?.role === 'NURSE') {
      navigate('/nurse-view', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  // Stable fetch function to prevent infinite re-renders
  const fetchData = useCallback(() => {
    const statusFilter = selectedStatus ? [selectedStatus] : [];
    fetchActiveEncounters(statusFilter);
  }, [selectedStatus, fetchActiveEncounters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    clearError();
    fetchData();
  };

  const handleViewDetails = encounterId => {
    navigate(`/encounters/${encounterId}`);
  };

  const getStatusBadgeColor = status => {
    switch (status) {
      case 'TRIAGE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ONGOING':
        return 'bg-blue-100 text-blue-800';
      case 'OBSERVATION':
        return 'bg-purple-100 text-purple-800';
      case 'DISPOSITION':
        return 'bg-green-100 text-green-800';
      case 'DISCHARGED':
        return 'bg-gray-100 text-gray-800';
      case 'ADMITTED':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Simple role check - redirect to access denied if not authorized
  if (!currentUser || !['DOCTOR', 'NURSE'].includes(currentUser.role)) {
    navigate('/access-denied', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-6">
        <div className="space-y-6">
          {/* Header dengan tombol kembali di posisi yang tepat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                {/* Tombol kembali dipindahkan di sini */}
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Kembali ke halaman utama"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Kembali ke halaman utama
                </button>
              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <DashboardCard>
            <div className="px-6 py-5">
              <h1 className="text-3xl font-bold text-gray-900">
                Halaman Kunjungan
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor dan kelola encounter pasien secara real-time
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-5">
              {['TRIAGE', 'ONGOING', 'OBSERVATION', 'DISPOSITION'].map(
                status => {
                  const count = encounters.filter(
                    e => e.status === status
                  ).length;
                  return (
                    <div
                      key={status}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${getStatusBadgeColor(
                              status
                            )}`}
                          >
                            {count}
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {count} {count === 1 ? 'encounter' : 'encounters'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </DashboardCard>

          {/* Status Filter */}
          <DashboardCard>
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Filter Status:
                </label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Status</option>
                  <option value="TRIAGE">Triage</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="OBSERVATION">Observasi</option>
                  <option value="DISPOSITION">Disposition</option>
                </select>
                <span className="text-sm text-gray-500">
                  Total: {encounters.length} encounter
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Encounters List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Kunjungan IGD Terbaru
                  </h3>
                </div>
              </div>

              {encounters.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">
                    Tidak ada encounter aktif
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Belum ada encounter yang terdaftar saat ini
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {encounters.map(encounter => (
                    <div
                      key={encounter.encounter_id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                                encounter.status
                              )}`}
                            >
                              {encounter.status}
                            </span>
                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              ID Pasien: {encounter.encounter_id}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {encounter.patient?.patient_name ||
                                'Unknown Patient'}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              <span className="font-medium">Keluhan:</span>{' '}
                              {encounter.chief_complaint}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {new Date(
                                  encounter.encounter_start_time
                                ).toLocaleString('id-ID')}
                              </span>
                              {encounter.medic_staff && (
                                <span className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  {encounter.medic_staff.staff_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* View Details Action */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() =>
                              handleViewDetails(encounter.encounter_id)
                            }
                            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                          >
                            Lihat Detail Kunjungan
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EncounterDashboard;
