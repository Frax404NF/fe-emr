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
      return response.data.data;
    } catch (error) {
      console.error('diagnosticTestService: Error creating diagnostic test:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal menyimpan pemeriksaan penunjang'
      );
    }
  },

  async getDiagnosticTestsByEncounter(encounterId, token, params = {}) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    };
    try {
      const response = await axios.get(
        `${API_BASE_URL}/encounters/${encounterId}/diagnostic-tests`,
        config
      );

      if (response.data.data && response.data.data.tests) {
        return response.data.data.tests;
      }

      return response.data.data || [];
    } catch (error) {
      console.error('diagnosticTestService: Error fetching tests:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data pemeriksaan penunjang'
      );
    }
  },

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
      console.error('diagnosticTestService: Error fetching test by ID:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil data pemeriksaan penunjang'
      );
    }
  },

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
      console.error('diagnosticTestService: Error updating test:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal update pemeriksaan penunjang'
      );
    }
  },

  async getAvailableTransitions(testId, token) {
    try {
      const test = await this.getDiagnosticTestById(testId, token);
      return test.available_transitions || [];
    } catch (error) {
      console.error('diagnosticTestService: Error getting transitions:', error);
      return [];
    }
  },

  async getVerificationReport(testId, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_BASE_URL}/diagnostic-tests/${testId}/verification`,
        config
      );
      return response.data.data;
    } catch (error) {
      console.error('diagnosticTestService: Error getting verification report:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Gagal mengambil laporan verifikasi'
      );
    }
  }
};

export default diagnosticTestApi;