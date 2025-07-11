import { useState } from 'react';
import { usePatientForm } from '../hooks/usePatients';
import patientService from '../services/patientService';

/**
 * PatientFormModal Component
 *
 * Modal form untuk menambah pasien baru, mendukung:
 * - Regular patient registration
 * - Emergency patient registration
 * - Form validation
 * - Loading states
 * - Error handling
 */
const PatientFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = usePatientForm({
    patient_name: '',
    NIK: '',
    date_of_birth: '',
    blood_type: '',
    gender: '',
    phone_number: '',
    emergency_contact_name: '',
    emergency_contact_phonenumber: '',
    patient_history_of_allergies: '',
    patient_disease_history: '',
  });

  // Handle form submission
  const onSubmit = async data => {
    setSubmitError('');
    try {
      const response = await patientService.createPatient(data);
      setSubmitSuccess(true);

      // Show success message briefly then close
      setTimeout(() => {
        setSubmitSuccess(false);
        resetForm();
        onSuccess && onSuccess(response.data);
        onClose();
      }, 1500);
    } catch (error) {
      setSubmitError(error.message);
      throw error; // Re-throw to let usePatientForm handle it
    }
  };

  // Handle mode change
  const handleModeChange = emergencyMode => {
    setIsEmergencyMode(emergencyMode);
    setSubmitError('');

    // Reset form first
    resetForm();

    // Update form data based on mode
    if (emergencyMode) {
      // Auto-fill emergency form with valid defaults
      const emergencyDefaults = {
        patient_name: 'NN (Belum Teridentifikasi), Pasien tidak sadarkan diri',
        emergency_contact_name: 'Keluarga/Pengantar',
        emergency_contact_phonenumber: '081000000000',
        patient_history_of_allergies:
          'Tidak diketahui - pasien tidak sadarkan diri',
        patient_disease_history: 'Tidak diketahui',
        is_emergency: true,
      };

      // Apply emergency defaults to all fields
      Object.keys(emergencyDefaults).forEach(field => {
        handleInputChange(field, emergencyDefaults[field]);
      });
    }
    // For regular patients, form is already reset to empty - no additional action needed
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      setSubmitError('');
      setSubmitSuccess(false);
      setIsEmergencyMode(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div
          className={`p-6 border-b ${isEmergencyMode ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2
                className={`text-xl font-bold ${isEmergencyMode ? 'text-red-800' : 'text-gray-900'}`}
              >
                {isEmergencyMode
                  ? '🚨 Pendaftaran Pasien Darurat'
                  : '👤 Tambah Pasien Baru'}
              </h2>
              <p
                className={`text-sm mt-1 ${isEmergencyMode ? 'text-red-600' : 'text-gray-600'}`}
              >
                {isEmergencyMode
                  ? 'Untuk pasien tidak sadarkan diri atau tidak teridentifikasi'
                  : 'Lengkapi data pasien untuk pendaftaran'}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
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

          {/* Mode Toggle */}
          <div className="mt-4 flex space-x-4">
            <button
              type="button"
              onClick={() => handleModeChange(false)}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isEmergencyMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pasien Regular
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(true)}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEmergencyMode
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pasien Darurat
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {isEmergencyMode
                      ? 'Pasien darurat berhasil didaftarkan!'
                      : 'Pasien berhasil didaftarkan!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {submitError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }}
            className="space-y-4"
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap {!isEmergencyMode && '*'}
                </label>
                <input
                  type="text"
                  value={formData.patient_name}
                  onChange={e =>
                    handleInputChange('patient_name', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.patient_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={
                    isEmergencyMode
                      ? 'NN (Belum Teridentifikasi)'
                      : 'Nama lengkap pasien'
                  }
                  required={!isEmergencyMode}
                />
                {errors.patient_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.patient_name}
                  </p>
                )}
              </div>

              {/* NIK */}
              {!isEmergencyMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK (16 digit) *
                  </label>
                  <input
                    type="text"
                    value={formData.NIK}
                    onChange={e => handleInputChange('NIK', e.target.value)}
                    maxLength="16"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.NIK ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1234567890123456"
                    required
                  />
                  {errors.NIK && (
                    <p className="mt-1 text-sm text-red-600">{errors.NIK}</p>
                  )}
                </div>
              )}

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={formData.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Date of Birth - only for regular patients */}
              {!isEmergencyMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={e =>
                      handleInputChange('date_of_birth', e.target.value)
                    }
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.date_of_birth
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.date_of_birth && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>
              )}

              {/* Blood Type - only for regular patients */}
              {!isEmergencyMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Golongan Darah
                  </label>
                  <select
                    value={formData.blood_type}
                    onChange={e =>
                      handleInputChange('blood_type', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Golongan Darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Number - only for regular patients */}
              {!isEmergencyMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={e =>
                      handleInputChange('phone_number', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="081234567890"
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              )}

              {/* Emergency Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kontak Darurat {isEmergencyMode && '(Jika diketahui)'}
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={e =>
                    handleInputChange('emergency_contact_name', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isEmergencyMode
                      ? 'Keluarga/Pengantar'
                      : 'Nama keluarga atau kontak darurat'
                  }
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Kontak Darurat {isEmergencyMode && '(Jika diketahui)'}
                </label>
                <input
                  type="tel"
                  value={formData.emergency_contact_phonenumber}
                  onChange={e =>
                    handleInputChange(
                      'emergency_contact_phonenumber',
                      e.target.value
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.emergency_contact_phonenumber
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="081234567890"
                />
                {errors.emergency_contact_phonenumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.emergency_contact_phonenumber}
                  </p>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Riwayat Alergi
                </label>
                <textarea
                  value={formData.patient_history_of_allergies}
                  onChange={e =>
                    handleInputChange(
                      'patient_history_of_allergies',
                      e.target.value
                    )
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isEmergencyMode
                      ? 'Tidak diketahui - pasien tidak sadarkan diri'
                      : 'Contoh: Alergi terhadap penisilin, seafood'
                  }
                />
              </div>

              {/* Disease History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Riwayat Penyakit
                </label>
                <textarea
                  value={formData.patient_disease_history}
                  onChange={e =>
                    handleInputChange('patient_disease_history', e.target.value)
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isEmergencyMode
                      ? 'Tidak diketahui - memerlukan pemeriksaan lebih lanjut'
                      : 'Contoh: Hipertensi, diabetes melitus'
                  }
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
                  isEmergencyMode
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    {isEmergencyMode
                      ? 'Mendaftarkan Pasien Darurat...'
                      : 'Mendaftarkan Pasien...'}
                  </div>
                ) : (
                  <>
                    {isEmergencyMode
                      ? '🚨 Daftarkan Pasien Darurat'
                      : '👤 Daftarkan Pasien'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientFormModal;
