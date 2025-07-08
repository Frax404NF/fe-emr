/**
 * Hooks index file
 * Export semua custom hooks untuk digunakan di komponen
 */

// Authentication hook
export { useAuth } from "./useAuth";

// Patient management hooks
export {
  usePatients,
  usePatientSearch,
  usePatientForm,
  usePatientDetail,
} from "./usePatients";
