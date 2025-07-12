import axios from "axios";
import envConfig from '../../config/env';

const API_BASE_URL = envConfig.API_BASE_URL;

const createVitalSign = async (encounterId, vitalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/encounters/${encounterId}/vitals`,
      vitalData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('vitalSignsService: Error creating vital sign:', error.response?.data);
    throw new Error(
      error.response?.data?.message || "Gagal menyimpan tanda vital"
    );
  }
};

const getVitalSignsByEncounter = async (encounterId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(
      `${API_BASE_URL}/encounters/${encounterId}/vitals`,
      config
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data tanda vital"
    );
  }
};

export default {
  createVitalSign,
  getVitalSignsByEncounter,
};
