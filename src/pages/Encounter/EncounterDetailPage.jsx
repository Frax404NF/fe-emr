import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEncounter } from "../../hooks/useEncounter";
import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";
import NotificationArea from "../../components/ui/NotificationArea";

// Komponen untuk Tanda Vital
const VitalSignsCard = ({ vitalSigns, formatDate }) => {
  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Tanda Vital</h2>
        {vitalSigns?.length > 0 ? (
          <div className="space-y-4">
            {vitalSigns.map((vital, index) => (
              <div
                key={vital.vital_sign_id || index}
                className="border-l-4 border-blue-500 pl-4"
              >
                <p className="text-sm text-gray-600 mb-2">
                  {formatDate(vital.measurement_time)}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {vital.temperature && (
                    <div>
                      <span className="font-medium">Suhu:</span>{" "}
                      {vital.temperature}°C
                    </div>
                  )}
                  {vital.heart_rate && (
                    <div>
                      <span className="font-medium">HR:</span>{" "}
                      {vital.heart_rate} BPM
                    </div>
                  )}
                  {vital.blood_pressure_systolic &&
                    vital.blood_pressure_diastolic && (
                      <div>
                        <span className="font-medium">TD:</span>{" "}
                        {vital.blood_pressure_systolic}/
                        {vital.blood_pressure_diastolic} mmHg
                      </div>
                    )}
                  {vital.oxygen_saturation && (
                    <div>
                      <span className="font-medium">SpO2:</span>{" "}
                      {vital.oxygen_saturation}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Data tanda vital belum tersedia</p>
        )}
      </div>
    </DashboardCard>
  );
};

// Komponen untuk Diagnosis
const DiagnosesCard = ({ diagnoses, formatDate }) => {
  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Diagnosis</h2>
        {diagnoses?.length > 0 ? (
          <div className="space-y-3">
            {diagnoses.map((diagnosis, index) => (
              <div
                key={diagnosis.diagnosis_id || index}
                className="border-l-4 border-green-500 pl-4"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{diagnosis.icd10_code}</span>
                  <span className="text-gray-600">-</span>
                  <span>{diagnosis.diagnosis_description}</span>
                </div>
                {diagnosis.diagnoses_notes && (
                  <p className="text-sm text-gray-600">
                    {diagnosis.diagnoses_notes}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(diagnosis.diagnosed_at)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Belum ada diagnosis yang dicatat</p>
        )}
      </div>
    </DashboardCard>
  );
};

// Komponen untuk Perawatan & Pengobatan
const TreatmentsCard = () => (
  <DashboardCard>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Perawatan & Pengobatan</h2>
      <div className="text-gray-600">
        <p>Data perawatan dan pengobatan akan ditampilkan di sini</p>
      </div>
    </div>
  </DashboardCard>
);

// Komponen untuk Pemeriksaan Diagnostik
const DiagnosticTestsCard = () => (
  <DashboardCard>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pemeriksaan Diagnostik</h2>
      <div className="text-gray-600">
        <p>Hasil pemeriksaan diagnostik akan ditampilkan di sini</p>
      </div>
    </div>
  </DashboardCard>
);

// Komponen untuk Catatan SOAP
const SoapNotesCard = ({ soapNotes, formatDate }) => {
  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">SOAP Notes</h2>
        {soapNotes?.length > 0 ? (
          <div className="space-y-4">
            {soapNotes.map((note, index) => (
              <div
                key={note.soap_note_id || index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <p className="text-sm text-gray-600 mb-3">
                  {formatDate(note.note_time)} - {note.noted_by?.staff_name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Subjective
                    </h4>
                    <p className="text-gray-600">{note.subjective || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Objective
                    </h4>
                    <p className="text-gray-600">{note.objective || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Assessment
                    </h4>
                    <p className="text-gray-600">{note.assessment || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Plan</h4>
                    <p className="text-gray-600">{note.plan || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Belum ada catatan SOAP</p>
        )}
      </div>
    </DashboardCard>
  );
};

// Komponen untuk Status Kunjungan & Disposition
const DispositionCard = ({ 
  encounter, 
  currentUser, 
  onStatusUpdate, 
  getStatusBadgeColor, 
  getNextStatusOptions, 
  canUserUpdateStatus, 
  getStatusDisplayName,
  statusUpdateLoading 
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const canUpdate = canUserUpdateStatus(encounter);
  const nextStatusOptions = getNextStatusOptions(encounter.status);
  const isStatusFinal = ["DISCHARGED", "ADMITTED"].includes(encounter.status);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    
    if (newStatus) {
      const confirmMessage = `Apakah Anda yakin ingin mengubah status dari "${getStatusDisplayName(encounter.status)}" ke "${getStatusDisplayName(newStatus)}"?`;
      
      if (window.confirm(confirmMessage)) {
        onStatusUpdate(newStatus);
      }
      // Reset selection after action (whether confirmed or cancelled)
      setSelectedStatus("");
    }
  };

  return (
    <DashboardCard>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Status Kunjungan & Disposition</h2>
        
        {/* Status Saat Ini */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Status Saat Ini
          </label>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-2 text-sm font-medium rounded-full ${getStatusBadgeColor(
                encounter.status
              )}`}
            >
              {getStatusDisplayName(encounter.status)}
            </span>
            {isStatusFinal && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Status Final
              </span>
            )}
          </div>
        </div>

        {/* Timeline Status */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 mb-3 block">
            Timeline Status
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Dimulai: {new Date(encounter.encounter_start_time).toLocaleString("id-ID")}
              </span>
            </div>
            {encounter.encounter_end_time && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Selesai: {new Date(encounter.encounter_end_time).toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Update Status Section */}
        {canUpdate && nextStatusOptions.length > 0 && !isStatusFinal && (
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-600 mb-3 block">
              Ubah Status Kunjungan
            </label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  disabled={statusUpdateLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Pilih status baru...</option>
                  {nextStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getStatusDisplayName(status)}
                    </option>
                  ))}
                </select>
                
                {statusUpdateLoading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-xs">Updating...</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-2">Opsi status yang tersedia:</p>
                <div className="space-y-1">
                  {nextStatusOptions.map((status) => (
                    <div key={status} className="flex items-start space-x-2">
                      <span className="font-medium">{getStatusDisplayName(status)}:</span>
                      <span className="text-gray-600">
                        {status === "ONGOING" && "Pasien sedang dalam perawatan aktif"}
                        {status === "OBSERVATION" && "Pasien memerlukan observasi lebih lanjut"}
                        {status === "DISPOSITION" && "Pasien siap untuk disposisi akhir"}
                        {status === "DISCHARGED" && "Pasien dapat pulang"}
                        {status === "ADMITTED" && "Pasien perlu rawat inap"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informasi untuk user yang tidak bisa update */}
        {!canUpdate && (
          <div className="border-t pt-4">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
              <p className="text-sm text-gray-600">
                {currentUser?.role === "NURSE" && isStatusFinal
                  ? "Hanya dokter yang dapat mengubah status final encounter."
                  : "Anda tidak memiliki izin untuk mengubah status encounter ini."}
              </p>
            </div>
          </div>
        )}

        {/* Tidak ada opsi update untuk status final */}
        {isStatusFinal && (
          <div className="border-t pt-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Encounter telah selesai dengan status {getStatusDisplayName(encounter.status)}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Information */}
        {encounter.medic_staff && (
          <div className="border-t pt-4 mt-4">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Tenaga Medis yang Menangani
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {encounter.medic_staff.staff_name}
                </p>
                <p className="text-xs text-gray-500">
                  {encounter.medic_staff.role} 
                  {encounter.medic_staff.specialization && 
                    ` - ${encounter.medic_staff.specialization}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

const EncounterDetailPage = () => {
  const { encounterId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Menggunakan useEncounter hook untuk state management
  const {
    currentEncounter,
    loading,
    error,
    fetchEncounterDetails,
    updateEncounterStatus,
    clearError,
    clearCurrentEncounter,
  } = useEncounter();

  const [notifications, setNotifications] = useState([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return navigate("/login");

    const loadEncounterDetails = async () => {
      try {
        // Clear previous error
        clearError();

        // Fetch encounter details menggunakan hook
        await fetchEncounterDetails(encounterId);
      } catch (error) {
        console.error("Failed to fetch encounter:", error);
        setNotifications([
          {
            type: "error",
            message: error.message || "Gagal memuat detail encounter",
            id: Date.now(),
          },
        ]);
      }
    };

    loadEncounterDetails();

    // Cleanup saat component unmount
    return () => {
      clearCurrentEncounter();
    };
  }, [
    encounterId,
    currentUser,
    navigate,
    fetchEncounterDetails,
    clearError,
    clearCurrentEncounter,
  ]);

  // Handle error dari hook
  useEffect(() => {
    if (error) {
      setNotifications((prev) => [
        ...prev,
        {
          type: "error",
          message: error,
          id: Date.now(),
        },
      ]);
    }
  }, [error]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleBackToDashboard = () => navigate("/encounter-dashboard");

  const getStatusColor = (status) => {
    const statusColors = {
      TRIAGE: "bg-orange-100 text-orange-800",
      ONGOING: "bg-blue-100 text-blue-800",
      OBSERVATION: "bg-purple-100 text-purple-800",
      DISPOSITION: "bg-indigo-100 text-indigo-800",
      DISCHARGED: "bg-green-100 text-green-800",
      ADMITTED: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getTriageColor = (triage) => {
    const triageColors = {
      RED: "bg-red-100 text-red-800",
      YELLOW: "bg-yellow-100 text-yellow-800",
      GREEN: "bg-green-100 text-green-800",
      BLACK: "bg-gray-100 text-gray-800",
    };
    return triageColors[triage] || "bg-gray-100 text-gray-800";
  };

  // Format date dengan lebih user-friendly
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      // Format: DD/MM/YYYY
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // Function untuk menampilkan age berdasarkan date_of_birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch (error) {
      return null;
    }
  };

  // Status management functions
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "TRIAGE":
        return "bg-yellow-100 text-yellow-800";
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      case "OBSERVATION":
        return "bg-purple-100 text-purple-800";
      case "DISPOSITION":
        return "bg-green-100 text-green-800";
      case "DISCHARGED":
        return "bg-gray-100 text-gray-800";
      case "ADMITTED":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const transitions = {
      TRIAGE: ["ONGOING"],
      ONGOING: ["OBSERVATION", "DISPOSITION"],
      OBSERVATION: ["ONGOING", "DISPOSITION"],
      DISPOSITION: ["DISCHARGED", "ADMITTED"],
    };
    return transitions[currentStatus] || [];
  };

  const canUserUpdateStatus = (encounter) => {
    if (!currentUser) return false;
    if (currentUser.role === "DOCTOR") return true;
    if (currentUser.role === "NURSE") {
      return !["DISCHARGED", "ADMITTED"].includes(encounter.status);
    }
    return false;
  };

  const getStatusDisplayName = (status) => {
    const statusNames = {
      TRIAGE: "Triage",
      ONGOING: "Sedang Ditangani",
      OBSERVATION: "Observasi",
      DISPOSITION: "Disposition",
      DISCHARGED: "Pulang",
      ADMITTED: "Rawat Inap",
    };
    return statusNames[status] || status;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!currentEncounter || statusUpdateLoading) return;

    setStatusUpdateLoading(true);
    try {
      await updateEncounterStatus(currentEncounter.encounter_id, newStatus);
      setNotifications((prev) => [
        ...prev,
        {
          type: "success",
          message: `Status berhasil diubah menjadi ${getStatusDisplayName(newStatus)}`,
          id: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Failed to update status:", error);
      setNotifications((prev) => [
        ...prev,
        {
          type: "error",
          message: error.message || "Gagal mengubah status encounter",
          id: Date.now(),
        },
      ]);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <NakesDashboardLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail encounter...</p>
        </div>
      </NakesDashboardLayout>
    );
  }

  if (!currentEncounter) {
    return (
      <NakesDashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-600">Encounter tidak ditemukan</p>
          <button
            onClick={() => navigate("/encounter-dashboard")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </NakesDashboardLayout>
    );
  }

  const {
    patient,
    status,
    triage_level,
    encounter_start_time,
    encounter_end_time,
    chief_complaint,
    vital_signs,
    diagnoses,
    soap_notes,
    medic_staff,
  } = currentEncounter;

  return (
    <NakesDashboardLayout>
      <NotificationArea
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Header yang disederhanakan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
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
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="ml-2">Kembali ke Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Kunjungan Pasien
            </h1>
            <div className="w-32"></div> {/* Spacer untuk alignment */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informasi Pasien */}
          <DashboardCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Informasi Pasien</h2>

              {/* Data Dasar Pasien */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nama Pasien
                  </label>
                  <p className="text-xl font-bold text-gray-900">
                    {patient?.patient_name || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tanggal Lahir
                  </label>
                  <p className="text-gray-800">
                    {patient?.date_of_birth ? (
                      <>
                        {formatDate(patient.date_of_birth)}
                        {calculateAge(patient.date_of_birth) && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({calculateAge(patient.date_of_birth)} tahun)
                          </span>
                        )}
                      </>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Jenis Kelamin
                  </label>
                  <p className="text-gray-800">
                    {patient?.gender === "LAKI_LAKI"
                      ? "Laki-laki"
                      : patient?.gender === "PEREMPUAN"
                      ? "Perempuan"
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Golongan Darah
                  </label>
                  <p className="text-gray-800 font-medium">
                    {patient?.blood_type || "-"}
                  </p>
                </div>
              </div>

              {/* Riwayat Medis */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Riwayat Medis
                </h3>

                {/* Riwayat Alergi */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Riwayat Alergi
                  </label>
                  {patient?.patient_history_of_allergies ? (
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            {patient.patient_history_of_allergies}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Tidak ada riwayat alergi yang tercatat
                    </p>
                  )}
                </div>

                {/* Riwayat Penyakit */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Riwayat Penyakit
                  </label>
                  {patient?.patient_disease_history ? (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      <p className="text-sm text-blue-700">
                        {patient.patient_disease_history}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Tidak ada riwayat penyakit yang tercatat
                    </p>
                  )}
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Informasi Encounter */}
          <DashboardCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Informasi Encounter</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-600">
                    Status:
                  </label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-600">
                    Triage:
                  </label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getTriageColor(
                      triage_level
                    )}`}
                  >
                    {triage_level}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Waktu Mulai
                  </label>
                  <p className="text-gray-800">
                    {formatDate(encounter_start_time)}
                  </p>
                </div>
                {encounter_end_time && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Waktu Selesai
                    </label>
                    <p className="text-gray-800">
                      {formatDate(encounter_end_time)}
                    </p>
                  </div>
                )}

                {/* Keluhan Utama */}
                <div className="border-t pt-4 mt-4">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Keluhan Utama
                  </label>
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                    <p className="text-gray-800">
                      {chief_complaint ||
                        "Tidak ada keluhan utama yang dicatat"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Semua card ditampilkan untuk preview */}
        <VitalSignsCard vitalSigns={vital_signs} formatDate={formatDate} />
        <DiagnosesCard diagnoses={diagnoses} formatDate={formatDate} />
        <TreatmentsCard />
        <DiagnosticTestsCard />
        <SoapNotesCard soapNotes={soap_notes} formatDate={formatDate} />
        <DispositionCard 
          encounter={currentEncounter}
          currentUser={currentUser}
          onStatusUpdate={handleStatusUpdate}
          getStatusBadgeColor={getStatusBadgeColor}
          getNextStatusOptions={getNextStatusOptions}
          canUserUpdateStatus={canUserUpdateStatus}
          getStatusDisplayName={getStatusDisplayName}
          statusUpdateLoading={statusUpdateLoading}
        />
      </div>
    </NakesDashboardLayout>
  );
};

export default EncounterDetailPage;
