import axios from "axios";
import envConfig from "../config/env";

const API_URL = envConfig.API_BASE_URL + "/auth";

// Create axios instance
const apiClient = axios.create();

// Basic response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log authentication errors for debugging
    if (error.response?.status === 401) {
      console.warn("Authentication failed or token expired");
    }
    return Promise.reject(error);
  }
);

const login = async (email, password) => {
  const response = await apiClient.post(`${API_URL}/login`, {
    email,
    password,
  });

  if (response.data.success && response.data.data) {
    return {
      ...response.data.data.user,
      access_token: response.data.data.access_token,
      refresh_token: response.data.data.refresh_token,
    };
  }

  throw new Error(response.data.message || "Login failed");
};

const signup = async (staffData) => {
  const response = await apiClient.post(`${API_URL}/register`, staffData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Registration failed");
};

const logout = async (token) => {
  const response = await apiClient.post(`${API_URL}/signout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getProfile = async (token) => {
  const response = await apiClient.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to fetch profile");
};

export default {
  login,
  signup,
  logout,
  getProfile,
};
