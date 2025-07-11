import axios from 'axios';
import envConfig from '../config/env';

const API_BASE_URL = envConfig.API_BASE_URL;

/**
 * Patient Service
 * Service layer untuk manajemen data pasien
 * Mengintegrasikan dengan backend Patient Management API
 */
class PatientService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add request interceptor untuk token
    this.api.interceptors.request.use(
      config => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor untuk error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token expired - redirect to login
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  getToken() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.access_token;
    } catch {
      return null;
    }
  }

  /**
   * Buat pasien baru
   * @param {Object} patientData - Data pasien
   * @returns {Promise<Object>} Response dengan data pasien yang dibuat
   */
  async createPatient(patientData) {
    try {
      const response = await this.api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Ambil daftar semua pasien dengan pagination
   * @param {number} page - Halaman
   * @param {number} limit - Batas per halaman
   * @returns {Promise<Object>} Response dengan list pasien dan metadata pagination
   */
  async getPatients(page = 1, limit = 20) {
    try {
      const response = await this.api.get('/patients', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Ambil detail pasien berdasarkan ID
   * @param {number} patientId - ID pasien
   * @returns {Promise<Object>} Response dengan detail pasien
   */
  async getPatientById(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update data pasien
   * @param {number} patientId - ID pasien
   * @param {Object} updateData - Data yang akan diupdate
   * @returns {Promise<Object>} Response dengan data pasien yang diupdate
   */
  async updatePatient(patientId, updateData) {
    try {
      const response = await this.api.put(`/patients/${patientId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update pasien darurat ke pasien reguler dengan data lengkap
   * @param {number} patientId - ID pasien
   * @param {Object} completeData - Data lengkap pasien
   * @returns {Promise<Object>} Response dengan data pasien yang diupdate
   */
  async updateEmergencyPatientToRegular(patientId, completeData) {
    try {
      const response = await this.api.put(
        `/patients/${patientId}/emergency-to-regular`,
        completeData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cari pasien berdasarkan NIK atau nama
   * @param {string} searchTerm - Term pencarian (min 3 karakter)
   * @returns {Promise<Object>} Response dengan hasil pencarian
   */
  async searchPatients(searchTerm) {
    if (searchTerm.length < 3) {
      return { data: { patients: [] } };
    }

    try {
      const response = await this.api.get('/patients/search', {
        params: { search: searchTerm },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Soft delete pasien (arsipkan)
   * @param {number} patientId - ID pasien
   * @returns {Promise<Object>} Response konfirmasi
   */
  async deletePatient(patientId) {
    try {
      const response = await this.api.delete(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Quick patient lookup untuk encounter - returns minimal data
   * @param {string} searchTerm - Term pencarian (nama atau NIK)
   * @returns {Promise<Object>} Response dengan hasil pencarian minimal
   */
  async quickPatientLookup(searchTerm) {
    if (searchTerm.length < 2) {
      return { data: { patients: [] } };
    }

    try {
      const response = await this.api.get('/patients/quick-lookup', {
        params: { 
          search: searchTerm,
          fields: 'patient_id,patient_name,NIK,date_of_birth,gender,blood_type,patient_history_of_allergies'
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get patient basic info for encounter
   * @param {number} patientId - ID pasien
   * @returns {Promise<Object>} Response dengan basic info pasien
   */
  async getPatientBasicInfo(patientId) {
    try {
      const response = await this.api.get(`/patients/${patientId}/basic-info`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object dari API
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message || 'Terjadi kesalahan pada server';
      const newError = new Error(message);
      newError.status = error.response.status;
      newError.data = error.response.data;
      return newError;
    } else if (error.request) {
      // Network error
      return new Error(
        'Gagal terhubung ke server. Periksa koneksi internet Anda.'
      );
    } else {
      // Other error
      return new Error(
        error.message || 'Terjadi kesalahan yang tidak diketahui'
      );
    }
  }
}

// Export singleton instance
const patientService = new PatientService();
export default patientService;
