import axios from 'axios';
import envConfig from '../../config/env';

const API_BASE = envConfig.API_BASE_URL;


const soapNotesApi = {
  // Ambil semua SOAP notes untuk encounter tertentu
  async getSoapNotesByEncounter(encounterId, token) {
    try {
      const res = await axios.get(`${API_BASE}/encounters/${encounterId}/soap-notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Pastikan selalu mengembalikan array
      if (Array.isArray(res.data)) {
        return res.data;
      } else if (Array.isArray(res.data.data)) {
        return res.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching SOAP notes:', error);
      throw error;
    }
  },

  // Tambah SOAP note baru
  async createSoapNote(encounterId, soapData, token) {
    try {
      const res = await axios.post(
        `${API_BASE}/encounters/${encounterId}/soap-notes`,
        soapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      console.error('Error creating SOAP note:', error);
      throw error;
    }
  }
};

export default soapNotesApi;
