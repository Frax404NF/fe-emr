import axios from 'axios';
import envConfig from '../../config/env';

const API_BASE = envConfig.API_BASE_URL;

const diagnosticTestApi = {
  async createDiagnosticTest(encounterId, testData, token) {
    try {
      const response = await axios.post(
        `${API_BASE}/encounters/${encounterId}/diagnostic-tests`,
        testData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create diagnostic test');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to create diagnostic test');
      }
      throw error;
    }
  },

  // Get all diagnostic tests for an encounter
  async getDiagnosticTestsByEncounter(encounterId, token) {
    try {
      const response = await axios.get(
        `${API_BASE}/encounters/${encounterId}/diagnostic-tests`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch diagnostic tests');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to fetch diagnostic tests');
      }
      throw error;
    }
  },

  // Get diagnostic test by ID
  async getDiagnosticTestById(testId, token) {
    try {
      const response = await axios.get(
        `${API_BASE}/diagnostic-tests/${testId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch diagnostic test');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to fetch diagnostic test');
      }
      throw error;
    }
  },

  // Update diagnostic test
  async updateDiagnosticTest(testId, updateData, token) {
    try {
      const response = await axios.patch(
        `${API_BASE}/diagnostic-tests/${testId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update diagnostic test');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to update diagnostic test');
      }
      throw error;
    }
  },

};

export default diagnosticTestApi;