import axios from "axios";
import envConfig from '../../config/env';

const API_BASE_URL = envConfig.API_BASE_URL;

const searchICD10 = async (terms, limit = 10, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { terms, limit },
  };
  try {
    const response = await axios.get(`${API_BASE_URL}/icd10/search`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mencari diagnosis");
  }
};

const createDiagnosis = async (encounterId, icd10Code, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(
      `${API_BASE_URL}/encounters/${encounterId}/diagnoses`,
      { icd10_code: icd10Code },
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal menambah diagnosis");
  }
};

const getDiagnosesByEncounter = async (encounterId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${API_BASE_URL}/encounters/${encounterId}/diagnoses`,
      config
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil diagnosis");
  }
};

export default {
  searchICD10,
  createDiagnosis,
  getDiagnosesByEncounter,
};
