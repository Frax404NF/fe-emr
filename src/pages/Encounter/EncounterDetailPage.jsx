import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEncounter } from '../../hooks/useEncounter';
import { formatDate, calculateAge, getStatusConfig, getTriageColor } from '../../utils/encounterUtils';
import NakesDashboardLayout from '../../layouts/NakesDashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import NotificationArea from '../../components/ui/NotificationArea';
import { VitalSignsCard, DiagnosesCard,
  TreatmentsCard,
  DiagnosticTestsCard,
  SoapNotesCard,
  DispositionCard
} from '../../components/encounter';

const EncounterDetailPage = () => {
  const { encounterId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    currentEncounter,
    loading,
    error,
    fetchEncounterDetails,
    updateEncounterStatus,
    clearError,
    clearCurrentEncounter
  } = useEncounter();

  const [notifications, setNotifications] = useState([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return navigate('/login');

    const loadData = async () => {
      try {
        clearError();
        await fetchEncounterDetails(encounterId);
      } catch (err) {
        setNotifications([{
          type: 'error',
          message: err.message || 'Gagal memuat detail encounter',
          id: Date.now()
        }]);
      }
    };

    loadData();
    return () => clearCurrentEncounter();
  }, [encounterId, currentUser, navigate, fetchEncounterDetails, clearError, clearCurrentEncounter]);

  useEffect(() => {
    if (error) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: error,
        id: Date.now()
      }]);
    }
  }, [error]);

  useEffect(() => {
    const timer = notifications.length > 0 && setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
    return () => timer && clearTimeout(timer);
  }, [notifications]);

  const handleBackToDashboard = () => navigate('/encounter-dashboard');

  const handleStatusUpdate = async (newStatus) => {
    if (!currentEncounter || statusUpdateLoading) return;

    setStatusUpdateLoading(true);
    try {
      await updateEncounterStatus(currentEncounter.encounter_id, newStatus);
      await fetchEncounterDetails(currentEncounter.encounter_id);
      setNotifications(prev => [...prev, {
        type: 'success',
        message: `Status berhasil diubah menjadi ${getStatusConfig(newStatus).displayName}`,
        id: Date.now()
      }]);
    } catch (err) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: err.message || 'Gagal mengubah status encounter',
        id: Date.now()
      }]);
    } finally {
      setStatusUpdateLoading(false);
    }
  };


  return (
    <NakesDashboardLayout>
      <NotificationArea notifications={notifications} setNotifications={setNotifications} />

      <div className="max-w-6xl mx-auto space-y-6 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Kembali ke halaman utama"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-2">Kembali ke Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Detail Kunjungan Pasien</h1>
            <div className="w-32"></div>
          </div>
        </div>

        {/* Skeleton loader jika loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        )}

        {/* Encounter tidak ditemukan */}
        {!loading && !currentEncounter && (
          <div className="text-center py-8">
            <p className="text-gray-600">Encounter tidak ditemukan</p>
            <button
              onClick={() => navigate('/encounter-dashboard')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        )}

        {/* Konten utama jika data sudah siap */}
        {!loading && currentEncounter && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Informasi Pasien</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama Pasien</label>
                      <p className="text-lg font-bold text-gray-900">{currentEncounter.patient?.patient_name || '-'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tanggal Lahir</label>
                        <p className="text-gray-800">
                          {currentEncounter.patient?.date_of_birth ? (
                            <>
                              {formatDate(currentEncounter.patient.date_of_birth)}
                              {calculateAge(currentEncounter.patient.date_of_birth) && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ({calculateAge(currentEncounter.patient.date_of_birth)} tahun)
                                </span>
                              )}
                            </>
                          ) : '-'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Jenis Kelamin</label>
                        <p className="text-gray-800">
                          {currentEncounter.patient?.gender === 'LAKI_LAKI' ? 'Laki-laki' : 
                           currentEncounter.patient?.gender === 'PEREMPUAN' ? 'Perempuan' : '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Golongan Darah</label>
                      <div className="flex items-center space-x-2">
                        {currentEncounter.patient?.blood_type ? (
                          <span className="text-lg font-bold">{currentEncounter.patient.blood_type}</span>
                        ) : (
                          <span className="text-gray-500 italic">Belum diketahui</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Riwayat Medis</h3>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Riwayat Alergi</label>
                      {currentEncounter.patient?.patient_history_of_allergies ? (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                          <p className="text-sm text-red-700">{currentEncounter.patient.patient_history_of_allergies}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Tidak ada riwayat alergi yang tercatat</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Riwayat Penyakit</label>
                      {currentEncounter.patient?.patient_disease_history ? (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                          <p className="text-sm text-blue-700">{currentEncounter.patient.patient_disease_history}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Tidak ada riwayat penyakit yang tercatat</p>
                      )}
                    </div>
                  </div>
                </div>
              </DashboardCard>
              <DashboardCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Informasi Encounter</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-600">Status:</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusConfig(currentEncounter.status).color}`}>
                        {currentEncounter.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-600">Triage:</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTriageColor(currentEncounter.triage_level)}`}>
                        {currentEncounter.triage_level}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Waktu Mulai</label>
                      <p className="text-gray-800">{formatDate(currentEncounter.encounter_start_time)}</p>
                    </div>
                    {currentEncounter.encounter_end_time && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Waktu Selesai</label>
                        <p className="text-gray-800">{formatDate(currentEncounter.encounter_end_time)}</p>
                      </div>
                    )}
                    <div className="border-t pt-4 mt-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Keluhan Utama</label>
                      <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                        <p className="text-gray-800">
                          {currentEncounter.chief_complaint || 'Tidak ada keluhan utama yang dicatat'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>

            <VitalSignsCard encounterId={encounterId} token={currentUser?.access_token} />
            <DiagnosesCard encounterId={encounterId} token={currentUser?.access_token} isDoctor={currentUser?.role === 'DOCTOR'} />
            <TreatmentsCard encounterId={encounterId} token={currentUser?.access_token} />
            <DiagnosticTestsCard encounterId={encounterId} token={currentUser?.access_token} />
            <SoapNotesCard encounterId={encounterId} token={currentUser?.access_token} />
            <DispositionCard
              encounter={currentEncounter}
              currentUser={currentUser}
              onStatusUpdate={handleStatusUpdate}
              statusUpdateLoading={statusUpdateLoading}
            />
          </>
        )}
      </div>
    </NakesDashboardLayout>
  );
};

export default EncounterDetailPage;