/**
 * Encounter State Machine Utilities
 * 
 * Utilities for managing encounter state transitions based on backend state machine
 */

export const ENCOUNTER_STATES = {
  TRIAGE: 'TRIAGE',
  ONGOING: 'ONGOING', 
  OBSERVATION: 'OBSERVATION',
  DISPOSITION: 'DISPOSITION',
  DISCHARGED: 'DISCHARGED',
  ADMITTED: 'ADMITTED'
};

export const STATE_LABELS = {
  [ENCOUNTER_STATES.TRIAGE]: 'Triage',
  [ENCOUNTER_STATES.ONGOING]: 'Sedang Berlangsung',
  [ENCOUNTER_STATES.OBSERVATION]: 'Observasi',
  [ENCOUNTER_STATES.DISPOSITION]: 'Disposisi',
  [ENCOUNTER_STATES.DISCHARGED]: 'Pulang',
  [ENCOUNTER_STATES.ADMITTED]: 'Rawat Inap'
};

export const STATE_TRANSITIONS = {
  [ENCOUNTER_STATES.TRIAGE]: [ENCOUNTER_STATES.ONGOING],
  [ENCOUNTER_STATES.ONGOING]: [ENCOUNTER_STATES.OBSERVATION, ENCOUNTER_STATES.DISPOSITION],
  [ENCOUNTER_STATES.OBSERVATION]: [ENCOUNTER_STATES.ONGOING, ENCOUNTER_STATES.DISPOSITION],
  [ENCOUNTER_STATES.DISPOSITION]: [ENCOUNTER_STATES.DISCHARGED, ENCOUNTER_STATES.ADMITTED]
};

export const FINAL_STATES = [
  ENCOUNTER_STATES.DISCHARGED,
  ENCOUNTER_STATES.ADMITTED
];

export const ACTIVE_STATES = [
  ENCOUNTER_STATES.TRIAGE,
  ENCOUNTER_STATES.ONGOING,
  ENCOUNTER_STATES.OBSERVATION,
  ENCOUNTER_STATES.DISPOSITION
];

/**
 * Check if a status is an active encounter state that should prevent new encounters
 * @param {string} status - The encounter status
 * @returns {boolean} - True if status is active and should prevent new encounters
 */
export const isActiveEncounterStatus = (status) => {
  return ACTIVE_STATES.includes(status);
};

/**
 * Check if a status is a final state that cannot be changed
 * @param {string} status - The encounter status
 * @returns {boolean} - True if status is final and cannot be modified
 */
export const isFinalEncounterStatus = (status) => {
  return FINAL_STATES.includes(status);
};

/**
 * Get valid next states for a given status
 * @param {string} currentStatus - The current encounter status
 * @returns {string[]} - Array of valid next states
 */
export const getValidNextStates = (currentStatus) => {
  return STATE_TRANSITIONS[currentStatus] || [];
};

/**
 * Validate if a state transition is allowed
 * @param {string} currentStatus - The current encounter status
 * @param {string} newStatus - The proposed new status
 * @returns {boolean} - True if transition is valid
 */
export const isValidTransition = (currentStatus, newStatus) => {
  // Initial state transition
  if (currentStatus === null && newStatus === ENCOUNTER_STATES.TRIAGE) {
    return true;
  }
  
  // Final states cannot be changed
  if (isFinalEncounterStatus(currentStatus)) {
    return false;
  }
  
  // Check if transition is allowed
  const allowedTransitions = getValidNextStates(currentStatus);
  return allowedTransitions.includes(newStatus);
};

/**
 * Get status label in Indonesian
 * @param {string} status - The encounter status
 * @returns {string} - Indonesian label for the status
 */
export const getStatusLabel = (status) => {
  return STATE_LABELS[status] || status;
};

export const calculateEncounterStats = encounters => {
  return {
    total: encounters.length,
    triage: encounters.filter(e => e.status === 'TRIAGE' || !e.triage_level)
      .length,
    ongoing: encounters.filter(e => e.status === 'ONGOING').length,
    observation: encounters.filter(e => e.status === 'OBSERVATION').length,
    active: encounters.filter(e =>
      ['TRIAGE', 'ONGOING', 'OBSERVATION', 'DISPOSITION'].includes(e.status)
    ).length,
    newToday: encounters.filter(e => {
      const today = new Date().toDateString();
      return new Date(e.encounter_start_time).toDateString() === today;
    }).length,
  };
};
