/**
 * Encounter State Machine Utilities
 *
 * Utilities for managing encounter state transitions based on backend state machine
 */

// Internal constants for active states (used by isActiveEncounterStatus)
const ACTIVE_STATES = ["TRIAGE", "ONGOING", "OBSERVATION", "DISPOSITION"];

// Internal constants for state labels (used by getStatusLabel)
const STATE_LABELS = {
  TRIAGE: "Triage",
  ONGOING: "Sedang Berlangsung",
  OBSERVATION: "Observasi",
  DISPOSITION: "Disposisi",
  DISCHARGED: "Pulang",
  ADMITTED: "Rawat Inap",
};

// Status configuration for encounter states
const STATUS_CONFIG = {
  TRIAGE: { 
    color: 'bg-orange-100 text-orange-800',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    displayName: 'Triage'
  },
  ONGOING: { 
    color: 'bg-blue-100 text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-800',
    displayName: 'Sedang Ditangani'
  },
  OBSERVATION: { 
    color: 'bg-purple-100 text-purple-800',
    badgeColor: 'bg-purple-100 text-purple-800',
    displayName: 'Observasi'
  },
  DISPOSITION: { 
    color: 'bg-indigo-100 text-indigo-800',
    badgeColor: 'bg-green-100 text-green-800',
    displayName: 'Disposition'
  },
  DISCHARGED: { 
    color: 'bg-green-100 text-green-800',
    badgeColor: 'bg-gray-100 text-gray-800',
    displayName: 'Pulang'
  },
  ADMITTED: { 
    color: 'bg-red-100 text-red-800',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    displayName: 'Rawat Inap'
  }
};

// Triage configuration for triage levels
const TRIAGE_CONFIG = {
  RED: 'bg-red-100 text-red-800',
  YELLOW: 'bg-yellow-100 text-yellow-800',
  GREEN: 'bg-green-100 text-green-800',
  BLACK: 'bg-gray-100 text-gray-800'
};

/**
 * Format date string to Indonesian locale
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string or '-' if invalid
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return '-';
  }
};

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth string
 * @returns {number|null} - Age in years or null if invalid
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return null;
  }
};

/**
 * Get status configuration for encounter status
 * @param {string} status - The encounter status
 * @returns {object} - Status configuration object
 */
export const getStatusConfig = (status) => 
  STATUS_CONFIG[status] || { 
    color: 'bg-gray-100 text-gray-800',
    badgeColor: 'bg-gray-100 text-gray-800',
    displayName: status 
  };

/**
 * Get triage color class for triage level
 * @param {string} triage - The triage level
 * @returns {string} - Tailwind CSS classes for triage color
 */
export const getTriageColor = (triage) => 
  TRIAGE_CONFIG[triage] || 'bg-gray-100 text-gray-800';

/**
 * Check if a status is an active encounter state that should prevent new encounters
 * @param {string} status - The encounter status
 * @returns {boolean} - True if status is active and should prevent new encounters
 */
export const isActiveEncounterStatus = (status) => {
  return ACTIVE_STATES.includes(status);
};

/**
 * Get status label in Indonesian
 * @param {string} status - The encounter status
 * @returns {string} - Indonesian label for the status
 */
export const getStatusLabel = (status) => {
  return STATE_LABELS[status] || status;
};

export const calculateEncounterStats = (encounters) => {
  return {
    total: encounters.length,
    triage: encounters.filter((e) => e.status === "TRIAGE" || !e.triage_level)
      .length,
    ongoing: encounters.filter((e) => e.status === "ONGOING").length,
    observation: encounters.filter((e) => e.status === "OBSERVATION").length,
    active: encounters.filter((e) =>
      ["TRIAGE", "ONGOING", "OBSERVATION", "DISPOSITION"].includes(e.status)
    ).length,
    newToday: encounters.filter((e) => {
      const today = new Date().toDateString();
      return new Date(e.encounter_start_time).toDateString() === today;
    }).length,
  };
};
