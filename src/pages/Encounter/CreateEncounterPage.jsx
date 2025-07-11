import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEncounter } from '../../hooks/useEncounter';
import NakesDashboardLayout from '../../layouts/NakesDashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import NotificationArea from '../../components/ui/NotificationArea';

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
  const { startEncounter, loading: encounterLoading } = useEncounter();

  // Form state
  const [formData, setFormData] = useState({
    patient_id: '',
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

  // Navigation handlers
  const handleBackToDashboard = () => {
    navigate(currentUser?.role === 'DOCTOR' ? '/dokter-view' : '/nurse-view');
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_id.trim()) {
      newErrors.patient_id = 'Patient ID wajib diisi';
    } else if (!/^\d+$/.test(formData.patient_id.trim())) {
      newErrors.patient_id = 'Patient ID harus berupa angka';
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
      const vitalData = {};
      Object.entries(formData.initial_vitals).forEach(([key, value]) => {
        if (value !== '') vitalData[key] = parseFloat(value);
      });

      const payload = {
        patient_id: parseInt(formData.patient_id),
        chief_complaint: formData.chief_complaint.trim(),
        triage_level: formData.triage_level,
        initial_vitals: vitalData,
      };

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
              aria-label="Kembali ke dashboard"
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
              <span className="ml-2">Kembali ke dashboard</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Buat Encounter Baru
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.patient_id}
                  onChange={e => handleChange('patient_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patient_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan ID pasien"
                />
                {errors.patient_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.patient_id}
                  </p>
                )}
              </div>

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
                  disabled={encounterLoading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {encounterLoading ? (
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
                      Membuat...
                    </span>
                  ) : (
                    'Buat Encounter'
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
    </NakesDashboardLayout>
  );
};

export default CreateEncounterPage;
