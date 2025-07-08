/**
 * Konstanta untuk role pengguna dalam sistem EMR
 * Digunakan untuk kontrol akses berbasis peran
 */
export const USER_ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR", 
  NURSE: "NURSE",
  PATIENT: "PATIENT"
};

/**
 * Konstanta untuk semua rute dalam aplikasi
 * Mempermudah maintenance dan menghindari typo
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN_DASHBOARD: "/admin-view",
  DOCTOR_DASHBOARD: "/dokter-view",
  NURSE_DASHBOARD: "/nurse-view", 
  PATIENT_DASHBOARD: "/patient-view",
  VISIT_DETAIL: "/visit-detail",
  INPATIENT_DETAIL: "/inpatient-detail"
};

/**
 * Konstanta untuk endpoint API
 * Mempermudah pengelolaan URL API
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register", 
    LOGOUT: "/api/auth/signout"
  },
  PATIENTS: {
    LIST: "/api/patients",
    DETAIL: "/api/patients/:id",
    CREATE: "/api/patients",
    UPDATE: "/api/patients/:id",
    DELETE: "/api/patients/:id"
  },
  VISITS: {
    LIST: "/api/visits",
    DETAIL: "/api/visits/:id",
    CREATE: "/api/visits",
    UPDATE: "/api/visits/:id"
  }
};
