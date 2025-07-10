import axios from "axios";
import envConfig from "../config/env";

const API_URL = envConfig.API_BASE_URL + "/encounters";

const apiClient = axios.create();

apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    } else {
      throw new Error("Authorization token required");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed - token may be expired");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

const startEncounter = async (encounterData) => {
  try {
    const response = await apiClient.post(API_URL, encounterData);
    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to start encounter");
  } catch (error) {
    console.error("Start encounter error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to start encounter"
    );
  }
};

const updateEncounterStatus = async (encounterId, newStatus) => {
  try {
    const response = await apiClient.put(`${API_URL}/${encounterId}/status`, {
      newStatus,
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || "Failed to update encounter status"
    );
  } catch (error) {
    console.error("Update encounter status error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update encounter status"
    );
  }
};

const getEncounterDetails = async (encounterId) => {
  try {
    const response = await apiClient.get(`${API_URL}/${encounterId}`);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || "Failed to fetch encounter details"
    );
  } catch (error) {
    console.error("Get encounter details error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch encounter details"
    );
  }
};

const listActiveEncounters = async (statusFilter = []) => {
  try {
    const params = {};
    if (statusFilter.length > 0) {
      params.status = statusFilter.join(",");
    }

    const response = await apiClient.get(API_URL, { params });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch encounters");
  } catch (error) {
    console.error("List active encounters error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch encounters"
    );
  }
};

export default {
  startEncounter,
  updateEncounterStatus,
  getEncounterDetails,
  listActiveEncounters,
};
