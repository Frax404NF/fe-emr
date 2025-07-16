import axios from "axios";
import envConfig from '../../config/env';

const API_BASE_URL = envConfig.API_BASE_URL;

const diagnosticTestApi = {
  async createDiagnosticTest(encounterId, testData, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/encounters/${encounterId}/diagnostic-tests`,
        testData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('diagnosticTestService: Error creating diagnostic test:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal menyimpan pemeriksaan penunjang'
      );
    }
  },

  // Get all diagnostic tests for an encounter
  async getDiagnosticTestsByEncounter(encounterId, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_BASE_URL}/encounters/${encounterId}/diagnostic-tests`,
        config
      );
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data pemeriksaan penunjang'
      );
    }
  },

  // Get diagnostic test by ID
  async getDiagnosticTestById(testId, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_BASE_URL}/diagnostic-tests/${testId}`,
        config
      );
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data pemeriksaan penunjang'
      );
    }
  },

  // Update diagnostic test
  async updateDiagnosticTest(testId, updateData, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/diagnostic-tests/${testId}`,
        updateData,
        config
      );
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Gagal update pemeriksaan penunjang'
      );
    }
  },

};

export default diagnosticTestApi;