import { useState, useEffect, useCallback } from 'react';
import patientService from '../services/patientService';

/**
 * File yang berisi kumpulan hooks untuk manajemen pasien
 * Disatukan untuk kemudahan penggunaan dan pengembangan
 */

/**
 * Hook untuk manajemen daftar pasien dengan pagination
 * @param {number} initialPage - Halaman awal
 * @param {number} initialLimit - Limit per halaman
 * @returns {Object} State dan functions untuk manajemen pasien
 */
const usePatients = (initialPage = 1, initialLimit = 20) => {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);

    try {
      const response = await patientService.getPatients(page, limit);
      setPatients(response.data.patients);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients(initialPage, initialLimit);
  }, [fetchPatients, initialPage, initialLimit]);

  const refreshPatients = () => {
    fetchPatients(pagination.page, pagination.limit);
  };

  const goToPage = page => {
    fetchPatients(page, pagination.limit);
  };

  return {
    patients,
    pagination,
    loading,
    error,
    refreshPatients,
    goToPage,
    fetchPatients,
  };
};

/**
 * Hook untuk pencarian pasien
 * @returns {Object} State dan functions untuk pencarian pasien
 */
const usePatientSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const searchPatients = useCallback(async searchTerm => {
    if (searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await patientService.searchPatients(searchTerm);
      setSearchResults(response.data.patients);
    } catch (err) {
      setSearchError(err.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchResults,
    isSearching,
    searchError,
    searchPatients,
    clearSearch,
  };
};

/**
 * Hook untuk form pasien dengan validasi
 * @param {Object} initialData - Data awal untuk form
 * @returns {Object} State dan functions untuk form pasien
 */

const usePatientForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData || {
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
    }
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const isEmergencyMode = formData.is_emergency;

    // Helper function for phone validation
    const validatePhoneNumber = phone => {
      if (!phone) return true; // Empty is allowed
      if (phone.length > 15) return false;
      // Indonesian phone number format: starts with +62/62/0, then 8, then 1-9, then 6-9 more digits
      const regex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
      return regex.test(phone);
    };

    // Required fields validation
    if (!formData.patient_name?.trim()) {
      newErrors.patient_name = 'Nama pasien wajib diisi';
    }

    // NIK validation - required only for regular patients
    if (!isEmergencyMode) {
      if (!formData.NIK?.trim()) {
        newErrors.NIK = 'NIK wajib diisi';
      } else if (!/^\d{16}$/.test(formData.NIK)) {
        newErrors.NIK = 'NIK harus 16 digit angka';
      }
    }

    // Date of birth validation - required only for regular patients
    if (!isEmergencyMode && !formData.date_of_birth) {
      newErrors.date_of_birth = 'Tanggal lahir wajib diisi';
    }

    // Gender validation - always required
    if (!formData.gender) {
      newErrors.gender = 'Jenis kelamin wajib dipilih';
    }

    // Phone number validation - optional but must be valid if provided
    if (formData.phone_number && !validatePhoneNumber(formData.phone_number)) {
      newErrors.phone_number =
        'Format nomor telepon tidak valid (contoh: 081234567890)';
    }

    if (
      formData.emergency_contact_phonenumber &&
      !validatePhoneNumber(formData.emergency_contact_phonenumber)
    ) {
      newErrors.emergency_contact_phonenumber =
        'Format nomor telepon darurat tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async onSubmit => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submissionData = { ...formData };

      // Remove empty blood_type field (enum should not receive empty strings)
      if (!submissionData.blood_type || submissionData.blood_type === '') {
        delete submissionData.blood_type;
      }

      // For emergency patients, remove empty required fields and set appropriate flags
      if (formData.is_emergency) {
        // Remove NIK and date_of_birth if empty (they'll be auto-generated on backend)
        if (!submissionData.NIK) {
          delete submissionData.NIK;
        }
        if (!submissionData.date_of_birth) {
          delete submissionData.date_of_birth;
        }
        // Remove blood_type and phone_number for emergency patients (not needed)
        delete submissionData.blood_type;
        delete submissionData.phone_number;
      }

      await onSubmit(submissionData);
      return true;
    } catch (error) {
      // Handle API errors
      if (error.message.includes('NIK sudah terdaftar')) {
        setErrors({ NIK: 'NIK sudah terdaftar di sistem' });
      } else {
        setErrors({ general: error.message });
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(
      initialData || {
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
      }
    );
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
};

/**
 * Hook untuk detail pasien
 * @param {number} patientId - ID pasien
 * @returns {Object} State dan functions untuk detail pasien
 */
const usePatientDetail = patientId => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatient = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await patientService.getPatientById(patientId);
      setPatient(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const refreshPatient = () => {
    fetchPatient();
  };

  return {
    patient,
    loading,
    error,
    refreshPatient,
  };
};

/**
 * Hook untuk quick patient lookup pada encounter creation
 * Optimized untuk performa yang lebih baik
 * @returns {Object} State dan functions untuk quick lookup
 */
const usePatientQuickLookup = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const quickLookup = useCallback(async searchTerm => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await patientService.quickPatientLookup(searchTerm);
      setSearchResults(response.data.patients || []);
    } catch (err) {
      setSearchError(err.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
  };

  return {
    searchResults,
    isSearching,
    searchError,
    quickLookup,
    clearSearch,
  };
};

// Ekspor semua hooks dalam satu object
export { usePatients, usePatientSearch, usePatientForm };
