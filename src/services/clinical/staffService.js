import axios from "axios";
import envConfig from '../../config/env';

const API_BASE_URL = envConfig.API_BASE_URL;

const staffApi = {
  async getStaffList(token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_BASE_URL}/staff`, config);
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengambil data staff");
  }
};

export default staffApi;
