// src/services/clinical/treatmentService.js
import axios from 'axios';
import envConfig from '../../config/env';

const API_BASE = envConfig.API_BASE_URL;

const treatmentApi = {
  async getTreatmentsByEncounter(encounterId, token) {
    try {
      const res = await axios.get(`${API_BASE}/encounters/${encounterId}/treatments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Return the full response object for compatibility with TreatmentsCard
      return res.data;
    } catch (error) {
      console.error('Error fetching treatments:', error);
      throw error;
    }
  },

  async createTreatment(encounterId, treatmentData, token) {
    try {
      const res = await axios.post(
        `${API_BASE}/encounters/${encounterId}/treatments`,
        treatmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      console.error('Error creating treatment:', error);
      throw error;
    }
  }
};

export default treatmentApi;
