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
const DispositionCard = () => (
  <DashboardCard>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Status Kunjungan & Disposition</h2>
      <div className="text-gray-600">
        <p>
          Informasi status akhir kunjungan dan disposition akan ditampilkan di
          sini
        </p>
      </div>
    </div>
  </DashboardCard>
);

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
    clearError,
    clearCurrentEncounter,
  } = useEncounter();

  const [notifications, setNotifications] = useState([]);

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
        <DispositionCard />
      </div>
    </NakesDashboardLayout>
  );
};

export default EncounterDetailPage;
