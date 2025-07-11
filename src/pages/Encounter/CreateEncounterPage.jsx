import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEncounter } from '../../hooks/useEncounter';
import { isActiveEncounterStatus, getStatusLabel } from '../../utils/encounterUtils';
import NakesDashboardLayout from '../../layouts/NakesDashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import NotificationArea from '../../components/ui/NotificationArea';
import PatientSelector from '../../components/patient/PatientSelector';
import PatientFormModal from '../../components/patient/PatientFormModal';

// Triage level options
const TRIAGE_LEVELS = [
  { value: 'RED', label: 'Merah (Emergensi)', color: 'text-red-600' },
  { value: 'YELLOW', label: 'Kuning (Urgent)', color: 'text-yellow-600' },
  { value: 'GREEN', label: 'Hijau (Less Urgent)', color: 'text-green-600' },
  { value: 'BLACK', label: 'Hitam (Non-Urgent)', color: 'text-gray-600' },
];

const CreateEncounterPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { startEncounter, checkActiveEncounter, loading: encounterLoading } = useEncounter();

  // Form state
  const [formData, setFormData] = useState({
    selectedPatient: null,
    chief_complaint: '',
    triage_level: '',
    initial_vitals: {
      temperature: '',
      heart_rate: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      respiratory_rate: '',
      oxygen_saturation: '',
      pain_scale: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [activeEncounter, setActiveEncounter] = useState(null);
  const [checkingActiveEncounter, setCheckingActiveEncounter] = useState(false);
  const [showPatientFormModal, setShowPatientFormModal] = useState(false);

  // Navigation handlers
  const handleBackToDashboard = () => {
    navigate(currentUser?.role === 'DOCTOR' ? '/dokter-view' : '/nurse-view');
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.selectedPatient) {
      newErrors.selectedPatient = 'Pasien wajib dipilih';
    } else if (activeEncounter && isActiveEncounterStatus(activeEncounter.status)) {
      newErrors.selectedPatient = `Pasien masih memiliki encounter aktif dengan status ${getStatusLabel(activeEncounter.status)}`;
    }

    if (!formData.chief_complaint.trim()) {
      newErrors.chief_complaint = 'Keluhan utama wajib diisi';
    } else if (formData.chief_complaint.trim().length < 10) {
      newErrors.chief_complaint = 'Keluhan utama minimal 10 karakter';
    }

    if (!formData.triage_level) {
      newErrors.triage_level = 'Level triage wajib dipilih';
    }

    const vitals = formData.initial_vitals;
    const validateRange = (value, min, max, field, message) => {
      if (value && (value < min || value > max)) {
        newErrors[field] = message;
      }
    };

    validateRange(
      vitals.temperature,
      30,
      45,
      'temperature',
      'Suhu harus antara 30-45°C'
    );
    validateRange(
      vitals.heart_rate,
      30,
      250,
      'heart_rate',
      'Denyut jantung harus antara 30-250 BPM'
    );
    validateRange(
      vitals.blood_pressure_systolic,
      60,
      250,
      'blood_pressure_systolic',
      'Tekanan sistolik harus antara 60-250 mmHg'
    );
    validateRange(
      vitals.blood_pressure_diastolic,
      30,
      150,
      'blood_pressure_diastolic',
      'Tekanan diastolik harus antara 30-150 mmHg'
    );
    validateRange(
      vitals.respiratory_rate,
      8,
      60,
      'respiratory_rate',
      'Respirasi harus antara 8-60 per menit'
    );
    validateRange(
      vitals.oxygen_saturation,
      50,
      100,
      'oxygen_saturation',
      'Saturasi O2 harus antara 50-100%'
    );
    validateRange(
      vitals.pain_scale,
      0,
      10,
      'pain_scale',
      'Skala nyeri harus antara 0-10'
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Mohon perbaiki kesalahan pada form',
      });
      return;
    }

    try {
      // Map vital signs to backend expected field names
      const vitalData = {};
      const vitalMapping = {
        'temperature': 'temperature',
        'heart_rate': 'heart_rate',
        'blood_pressure_systolic': 'systolic',
        'blood_pressure_diastolic': 'diastolic',
        'respiratory_rate': 'respiratory_rate',
        'oxygen_saturation': 'oxygen_saturation',
        'pain_scale': 'pain_scale'
      };

      Object.entries(formData.initial_vitals).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          const backendFieldName = vitalMapping[key] || key;
          vitalData[backendFieldName] = parseFloat(value);
        }
      });

      const payload = {
        patient_id: formData.selectedPatient.patient_id,
        chief_complaint: formData.chief_complaint.trim(),
        triage_level: formData.triage_level,
        // Only include initial_vitals if there are actual values
        ...(Object.keys(vitalData).length > 0 && { initial_vitals: vitalData }),
      };

      console.log('Payload being sent:', payload); // Debug log

      const newEncounter = await startEncounter(payload);
      setNotification({
        type: 'success',
        message: 'Encounter berhasil dibuat!',
      });

      setTimeout(
        () => navigate(`/encounter/${newEncounter.encounter_id}`),
        2000
      );
    } catch (error) {
      console.error('Failed to create encounter:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Gagal membuat encounter',
      });
    }
  };

  // Form change handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePatientSelect = async (patient) => {
    setFormData(prev => ({ ...prev, selectedPatient: patient }));
    if (errors.selectedPatient) setErrors(prev => ({ ...prev, selectedPatient: '' }));
    
    // Clear previous active encounter state
    setActiveEncounter(null);
    
    if (patient) {
      setCheckingActiveEncounter(true);
      try {
        const activeEnc = await checkActiveEncounter(patient.patient_id);
        if (activeEnc && isActiveEncounterStatus(activeEnc.status)) {
          setActiveEncounter(activeEnc);
          setNotification({
            type: 'warning',
            message: `Pasien ${patient.patient_name} masih memiliki encounter aktif dengan status ${getStatusLabel(activeEnc.status)}. Selesaikan encounter tersebut terlebih dahulu.`
          });
        } else {
          // Clear active encounter if status is not active (e.g., DISCHARGED, ADMITTED)
          setActiveEncounter(null);
        }
      } catch (error) {
        console.error('Error checking active encounter:', error);
        // For MVP: Don't block the workflow if active encounter check fails
        // Just log the error and allow encounter creation
        setActiveEncounter(null);
        console.warn('Active encounter check failed, allowing encounter creation to proceed');
      } finally {
        setCheckingActiveEncounter(false);
      }
    }
  };

  // Handle new patient registration
  const handleOpenPatientFormModal = () => {
    setShowPatientFormModal(true);
  };

  const handleClosePatientFormModal = () => {
    setShowPatientFormModal(false);
  };

  const handlePatientCreated = (newPatient) => {
    // Automatically select the newly created patient
    setFormData(prev => ({ ...prev, selectedPatient: newPatient }));
    setShowPatientFormModal(false);
    setNotification({
      type: 'success',
      message: `Pasien ${newPatient.patient_name} berhasil didaftarkan dan dipilih.`
    });
  };

  // Helper function to calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleVitalChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      initial_vitals: { ...prev.initial_vitals, [field]: value },
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Role check
  if (!currentUser || !['DOCTOR', 'NURSE'].includes(currentUser.role)) {
    navigate('/access-denied', { replace: true });
    return null;
  }

  return (
    <NakesDashboardLayout>
      <NotificationArea
        notifications={
          notification
            ? [
                {
                  ...notification,
                  id: Date.now(),
                },
              ]
            : []
        }
        setNotifications={() => setNotification(null)}
      />

      <div className="max-w-4xl mx-auto space-y-6 p-4">
        {/* Header minimalis */}
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
              <span className="ml-2">Kembali ke halaman utama</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Buat Kunjungan Baru
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <PatientSelector
                selectedPatient={formData.selectedPatient}
                onPatientSelect={handlePatientSelect}
                error={errors.selectedPatient}
              />

              {/* Add New Patient Button */}
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Pasien Tidak Ditemukan?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenPatientFormModal}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Daftar Pasien Baru</span>
                </button>
              </div>

              {/* Selected Patient Info */}
              {formData.selectedPatient && (
                <div className={`border rounded-lg p-4 ${
                  activeEncounter && isActiveEncounterStatus(activeEncounter.status)
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-medium ${
                      activeEncounter && isActiveEncounterStatus(activeEncounter.status) ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      {activeEncounter && isActiveEncounterStatus(activeEncounter.status) ? '⚠️ Pasien Memiliki Encounter Aktif' : 'Informasi Pasien Terpilih'}
                    </h4>
                    {checkingActiveEncounter && (
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-1"></div>
                        Memeriksa encounter aktif...
                      </div>
                    )}
                  </div>

                  {activeEncounter && isActiveEncounterStatus(activeEncounter.status) && (
                    <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-md">
                      <p className="text-sm font-medium text-red-800">
                        Encounter ID: {activeEncounter.encounter_id}
                      </p>
                      <p className="text-sm text-red-700">
                        Status: <span className="font-medium">{getStatusLabel(activeEncounter.status)}</span>
                      </p>
                      <p className="text-sm text-red-700">
                        Keluhan: {activeEncounter.chief_complaint}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Selesaikan kunjungan ini terlebih dahulu sebelum membuat kunjungan baru.
                      </p>
                      <div className="mt-2 text-xs text-red-500">
                        <p className="font-medium">Status yang memblokir kunjungan baru:</p>
                        <p>• TRIAGE, ONGOING, OBSERVATION, DISPOSITION</p>
                        <p className="mt-1 font-medium">Status yang mengizinkan kunjungan baru:</p>
                        <p>• DISCHARGED (Pulang), ADMITTED (Rawat Inap)</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">Nama:</span>{' '}
                      <span className="text-blue-900">{formData.selectedPatient.patient_name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">NIK:</span>{' '}
                      <span className="text-blue-900">{formData.selectedPatient.NIK}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Umur:</span>{' '}
                      <span className="text-blue-900">
                        {calculateAge(formData.selectedPatient.date_of_birth)} tahun
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Jenis Kelamin:</span>{' '}
                      <span className="text-blue-900">
                        {formData.selectedPatient.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </div>
                    {formData.selectedPatient.blood_type && (
                      <div>
                        <span className="font-medium text-blue-700">Golongan Darah:</span>{' '}
                        <span className="text-blue-900">{formData.selectedPatient.blood_type}</span>
                      </div>
                    )}
                    {formData.selectedPatient.patient_history_of_allergies && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-red-700">⚠️ Riwayat Alergi:</span>{' '}
                        <span className="text-red-800">{formData.selectedPatient.patient_history_of_allergies}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Chief Complaint */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keluhan Utama <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.chief_complaint}
                  onChange={e =>
                    handleChange('chief_complaint', e.target.value)
                  }
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.chief_complaint
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Deskripsikan keluhan utama pasien"
                />
                {errors.chief_complaint && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.chief_complaint}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Minimal 10 karakter
                </p>
              </div>

              {/* Triage Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level Triage <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.triage_level}
                  onChange={e => handleChange('triage_level', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.triage_level ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih level triage</option>
                  {TRIAGE_LEVELS.map(level => (
                    <option
                      key={level.value}
                      value={level.value}
                      className={level.color}
                    >
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.triage_level && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.triage_level}
                  </p>
                )}
              </div>

              {/* Initial Vitals */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tanda Vital Awal (Opsional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: 'Suhu (°C)',
                      field: 'temperature',
                      min: 30,
                      max: 45,
                      step: '0.1',
                      placeholder: '36.5',
                    },
                    {
                      label: 'Denyut Jantung (BPM)',
                      field: 'heart_rate',
                      min: 30,
                      max: 250,
                      placeholder: '80',
                    },
                    {
                      label: 'Sistolik (mmHg)',
                      field: 'blood_pressure_systolic',
                      min: 60,
                      max: 250,
                      placeholder: '120',
                    },
                    {
                      label: 'Diastolik (mmHg)',
                      field: 'blood_pressure_diastolic',
                      min: 30,
                      max: 150,
                      placeholder: '80',
                    },
                    {
                      label: 'Respirasi (per menit)',
                      field: 'respiratory_rate',
                      min: 8,
                      max: 60,
                      placeholder: '20',
                    },
                    {
                      label: 'Saturasi O2 (%)',
                      field: 'oxygen_saturation',
                      min: 50,
                      max: 100,
                      placeholder: '98',
                    },
                    {
                      label: 'Skala Nyeri (0-10)',
                      field: 'pain_scale',
                      min: 0,
                      max: 10,
                      placeholder: '0',
                    },
                  ].map(vital => (
                    <div key={vital.field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {vital.label}
                      </label>
                      <input
                        type="number"
                        min={vital.min}
                        max={vital.max}
                        step={vital.step}
                        value={formData.initial_vitals[vital.field]}
                        onChange={e =>
                          handleVitalChange(vital.field, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[vital.field]
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder={vital.placeholder}
                      />
                      {errors[vital.field] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[vital.field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={encounterLoading || (activeEncounter && isActiveEncounterStatus(activeEncounter.status)) || checkingActiveEncounter}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                    activeEncounter && isActiveEncounterStatus(activeEncounter.status)
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {encounterLoading || checkingActiveEncounter ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {encounterLoading ? 'Membuat...' : 'Memeriksa...'}
                    </span>
                  ) : activeEncounter && isActiveEncounterStatus(activeEncounter.status) ? (
                    'Encounter Aktif Ditemukan'
                  ) : (
                    'Buat Kunjungan'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBackToDashboard}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </DashboardCard>
      </div>

      {/* Patient Form Modal */}
      <PatientFormModal
        isOpen={showPatientFormModal}
        onClose={handleClosePatientFormModal}
        onSuccess={handlePatientCreated}
      />
    </NakesDashboardLayout>
  );
};

export default CreateEncounterPage;
