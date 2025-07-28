import axios from 'axios';
import envConfig from '../config/env';

const API_BASE_URL = envConfig.API_BASE_URL;

class AdminService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    this.api.interceptors.request.use(
      config => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for better error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token expired - redirect to login
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  getToken() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.access_token;
    } catch {
      return null;
    }
  }

  // ===================== Dashboard Analytics =====================
  async getDashboardStats() {
    try {
      const response = await this.api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===================== Blockchain Management =====================
  async getBlockchainTests(filters = {}) {
    try {
      const response = await this.api.get('/admin/blockchain/tests', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async retryBlockchainVerification(testId) {
    try {
      const response = await this.api.post(`/admin/blockchain/retry/${testId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===================== User Management =====================
  async getAllUsers(roleFilter = '') {
    try {
      const params = roleFilter ? { role: roleFilter } : {};
      const response = await this.api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserStatus(staffId, isActive) {
    try {
      const response = await this.api.patch(`/admin/users/${staffId}/status`, { 
        is_active: isActive 
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===================== System Monitoring =====================
  async getSystemHealth() {
    try {
      const response = await this.api.get('/admin/system/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===================== Helper Methods =====================
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Server error occurred';
      const newError = new Error(message);
      newError.status = error.response.status;
      newError.data = error.response.data;
      return newError;
    } else if (error.request) {
      return new Error('Network error - please check your connection');
    } else {
      return new Error(error.message || 'Unknown error occurred');
    }
  }

  // ===================== Utility Methods =====================
  getEtherscanUrl(txHash) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }

  formatTestStatus(status) {
    const statusMap = {
      'REQUESTED': 'Diminta',
      'IN_PROGRESS': 'Dalam Proses',
      'COMPLETED': 'Selesai',
      'RESULT_VERIFIED': 'Terverifikasi Blockchain'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status) {
    const colorMap = {
      'REQUESTED': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-yellow-100 text-yellow-800',
      'RESULT_VERIFIED': 'bg-green-100 text-green-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }
}

const adminService = new AdminService();
export default adminService;