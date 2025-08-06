import axios from 'axios';
import envConfig from '../config/env';

const API_URL = envConfig.API_BASE_URL + '/encounters';

const apiClient = axios.create();

apiClient.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    } else {
      throw new Error('Authorization token required');
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Authentication failed - token may be expired');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

const startEncounter = async encounterData => {
  try {
    const response = await apiClient.post(API_URL, encounterData);
    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to start encounter');
  } catch (error) {
    console.error('Start encounter error:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to start encounter'
    );
  }
};

const updateEncounterStatus = async (encounterId, newStatus, dispositionData = null) => {
  try {
    const payload = { newStatus };
    
    // Add disposition data for final statuses
    if (['DISCHARGED', 'ADMITTED'].includes(newStatus) && dispositionData) {
      payload.disposition = dispositionData;
    }


    const response = await apiClient.put(`${API_URL}/${encounterId}/status`, payload);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || 'Failed to update encounter status'
    );
  } catch (error) {
    console.error('Update encounter status error:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to update encounter status'
    );
  }
};

const getEncounterDetails = async encounterId => {
  try {
    const response = await apiClient.get(`${API_URL}/${encounterId}`);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || 'Failed to fetch encounter details'
    );
  } catch (error) {
    console.error('Get encounter details error:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch encounter details'
    );
  }
};

const listActiveEncounters = async (statusFilter = []) => {
  try {
    const params = {};
    if (statusFilter.length > 0) {
      params.status = statusFilter.join(',');
    }

    const response = await apiClient.get(API_URL, { params });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch encounters');
  } catch (error) {
    console.error('List active encounters error:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch encounters'
    );
  }
};

const checkActiveEncounter = async patientId => {
  try {
    console.log('Checking active encounter for patient ID:', patientId);
    
    // First, get patient info to match by name if needed
    let patientInfo = null;
    try {
      const patientResponse = await apiClient.get(`${envConfig.API_BASE_URL}/patients/${patientId}`);
      if (patientResponse.data.success) {
        patientInfo = patientResponse.data.data;
      }
    } catch (error) {
      console.log('Could not fetch patient info:', error);
    }
    
    // Use the existing active encounters endpoint
    const response = await apiClient.get(API_URL);

    if (response.data.success) {
      const encounters = response.data.data;
      
      // Find active encounter for this patient
      const activeEncounter = encounters.find(enc => {
        // Handle multiple possible patient ID structures
        let encPatientId;
        
        // Check all possible patient ID locations
        if (enc.patient_id) {
          encPatientId = enc.patient_id;
        } else if (enc.patient?.patient_id) {
          encPatientId = enc.patient.patient_id;
        } else if (enc.patient?.id) {
          encPatientId = enc.patient.id;
        } else if (enc.patientId) {
          encPatientId = enc.patientId;
        } else if (enc.patient_ID) {
          encPatientId = enc.patient_ID;
        } else if (enc.Patient_ID) {
          encPatientId = enc.Patient_ID;
        }
        
        // Try to match by patient ID first
        let isMatchingPatient = encPatientId === parseInt(patientId) || encPatientId === patientId;
        
        // If no patient ID match and we have patient info, try matching by name
        if (!isMatchingPatient && patientInfo && enc.patient?.patient_name) {
          isMatchingPatient = enc.patient.patient_name === patientInfo.patient_name;
        }
        
        const isActiveStatus = ['TRIAGE', 'ONGOING', 'OBSERVATION', 'DISPOSITION'].includes(enc.status?.toUpperCase());
        
        return isMatchingPatient && isActiveStatus;
      });
      
      if (activeEncounter) {
        console.log('Active encounter found:', activeEncounter.encounter_id, 'Status:', activeEncounter.status);
      }
      
      return activeEncounter || null;
    }

    return null;
  } catch (error) {
    console.error('Check active encounter error:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
};

export default {
  startEncounter,
  updateEncounterStatus,
  getEncounterDetails,
  listActiveEncounters,
  checkActiveEncounter,
};
