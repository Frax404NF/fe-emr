import { useState } from "react";
import {
  usePatients,
  usePatientSearch,
  usePatientForm,
} from "../hooks/usePatients";
import { useAuth } from "../hooks/useAuth";
import { USER_ROLES } from "../constants";
import patientService from "../services/patientService";

/**
 * PatientManagement Component
 * Komponen utama untuk manajemen pasien dengan fitur CRUD dan pencarian
 */
const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("list"); // list, add, search
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get current user for role-based access control
  const { currentUser } = useAuth();

  // Hooks untuk manajemen pasien
  const { patients, pagination, loading, error, refreshPatients, goToPage } =
    usePatients();

  const { searchResults, isSearching, searchPatients, clearSearch } =
    usePatientSearch();

  const [searchTerm, setSearchTerm] = useState("");
  const [showingSearch, setShowingSearch] = useState(false);

  // Handle pencarian pasien
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      setShowingSearch(true);
      await searchPatients(term);
    } else {
      setShowingSearch(false);
      clearSearch();
    }
  };

  // Handle delete pasien
  const handleDeletePatient = async (patientId, patientName) => {
    if (window.confirm(`Yakin ingin mengarsipkan pasien ${patientName}?`)) {
      try {
        await patientService.deletePatient(patientId);
        refreshPatients();
        alert("Pasien berhasil diarsipkan");
      } catch (error) {
        alert("Gagal mengarsipkan pasien: " + error.message);
      }
    }
  };

  // Handle view detail pasien
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const displayPatients = showingSearch ? searchResults : patients;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Manajemen Pasien
        </h2>

        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Daftar Pasien
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "add"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tambah Pasien
          </button>
        </div>
      </div>

      {/* Content berdasarkan tab aktif */}
      {activeTab === "list" && (
        <PatientList
          patients={displayPatients}
          pagination={pagination}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          isSearching={isSearching}
          showingSearch={showingSearch}
          currentUserRole={currentUser?.role}
          onSearch={handleSearch}
          onViewPatient={handleViewPatient}
          onDeletePatient={handleDeletePatient}
          onPageChange={goToPage}
          onClearSearch={() => {
            setSearchTerm("");
            setShowingSearch(false);
            clearSearch();
          }}
        />
      )}

      {activeTab === "add" && (
        <PatientForm
          onSuccess={() => {
            setActiveTab("list");
            refreshPatients();
          }}
          onCancel={() => setActiveTab("list")}
        />
      )}

      {/* Modal untuk detail pasien */}
      {showModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => {
            setShowModal(false);
            setSelectedPatient(null);
          }}
          onEdit={(patient) => {
            // TODO: Implementasi edit pasien
            console.log("Edit patient:", patient);
          }}
        />
      )}
    </div>
  );
};

/**
 * PatientList Component
 * Komponen untuk menampilkan daftar pasien dengan pencarian dan pagination
 */
const PatientList = ({
  patients,
  pagination,
  loading,
  error,
  searchTerm,
  isSearching,
  showingSearch,
  currentUserRole,
  onSearch,
  onViewPatient,
  onDeletePatient,
  onPageChange,
  onClearSearch,
}) => {
  if (loading && !showingSearch) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Memuat data pasien...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Terjadi kesalahan
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan NIK atau nama (min 3 karakter)"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Info */}
      {showingSearch && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-blue-800">
              Menampilkan {patients.length} hasil pencarian untuk &quot;
              {searchTerm}&quot;
            </p>
            <button
              onClick={onClearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Kembali ke daftar lengkap
            </button>
          </div>
        </div>
      )}

      {/* Patient Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIK
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Lahir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis Kelamin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.patient_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {patient.NIK}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.patient_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(patient.date_of_birth).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onViewPatient(patient)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Lihat
                  </button>
                  {/* Only show delete button for non-NURSE roles */}
                  {currentUserRole !== USER_ROLES.NURSE && (
                    <button
                      onClick={() =>
                        onDeletePatient(patient.patient_id, patient.patient_name)
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      Arsipkan
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {patients.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {showingSearch ? "Tidak ada hasil pencarian" : "Belum ada pasien"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {showingSearch
              ? `Tidak ditemukan pasien dengan kata kunci "${searchTerm}"`
              : "Mulai dengan menambahkan pasien baru."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!showingSearch && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                sampai{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                dari <span className="font-medium">{pagination.total}</span>{" "}
                pasien
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === pagination.page;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => onPageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        isCurrentPage
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * PatientForm Component
 * Komponen form untuk menambah pasien baru
 */
const PatientForm = ({ onSuccess, onCancel }) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = usePatientForm();

  const onSubmitForm = async (data) => {
    await patientService.createPatient(data);
    onSuccess?.();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit(onSubmitForm);
    if (success) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tambah Pasien Baru
        </h3>

        {errors.general && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{errors.general}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div>
            <label
              htmlFor="patient_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap *
            </label>
            <input
              type="text"
              id="patient_name"
              value={formData.patient_name}
              onChange={(e) =>
                handleInputChange("patient_name", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.patient_name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.patient_name && (
              <p className="mt-1 text-sm text-red-600">{errors.patient_name}</p>
            )}
          </div>

          {/* NIK */}
          <div>
            <label
              htmlFor="NIK"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NIK (16 digit) *
            </label>
            <input
              type="text"
              id="NIK"
              value={formData.NIK}
              onChange={(e) => handleInputChange("NIK", e.target.value)}
              maxLength="16"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.NIK ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="1234567890123456"
            />
            {errors.NIK && (
              <p className="mt-1 text-sm text-red-600">{errors.NIK}</p>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Lahir *
            </label>
            <input
              type="date"
              id="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) =>
                handleInputChange("date_of_birth", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date_of_birth ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jenis Kelamin *
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.gender ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="LAKI_LAKI">Laki-laki</option>
              <option value="PEREMPUAN">Perempuan</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>

          {/* Golongan Darah */}
          <div>
            <label
              htmlFor="blood_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Golongan Darah
            </label>
            <select
              id="blood_type"
              value={formData.blood_type}
              onChange={(e) => handleInputChange("blood_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Golongan Darah</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) =>
                handleInputChange("phone_number", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone_number ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="081234567890"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
            )}
          </div>
        </div>

        {/* Kontak Darurat */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Kontak Darurat
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="emergency_contact_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Kontak Darurat
              </label>
              <input
                type="text"
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) =>
                  handleInputChange("emergency_contact_name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama keluarga/kerabat"
              />
            </div>

            <div>
              <label
                htmlFor="emergency_contact_phonenumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Kontak Darurat
              </label>
              <input
                type="tel"
                id="emergency_contact_phonenumber"
                value={formData.emergency_contact_phonenumber}
                onChange={(e) =>
                  handleInputChange(
                    "emergency_contact_phonenumber",
                    e.target.value
                  )
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.emergency_contact_phonenumber
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="081234567890"
              />
              {errors.emergency_contact_phonenumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.emergency_contact_phonenumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Riwayat Medis */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Riwayat Medis
          </h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="patient_history_of_allergies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Riwayat Alergi
              </label>
              <textarea
                id="patient_history_of_allergies"
                value={formData.patient_history_of_allergies}
                onChange={(e) =>
                  handleInputChange(
                    "patient_history_of_allergies",
                    e.target.value
                  )
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Alergi terhadap penisilin, seafood"
              />
            </div>

            <div>
              <label
                htmlFor="patient_disease_history"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Riwayat Penyakit
              </label>
              <textarea
                id="patient_disease_history"
                value={formData.patient_disease_history}
                onChange={(e) =>
                  handleInputChange("patient_disease_history", e.target.value)
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Hipertensi, diabetes melitus"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : "Tambah Pasien"}
        </button>
      </div>
    </form>
  );
};

/**
 * PatientDetailModal Component
 * Modal untuk menampilkan detail pasien
 */
const PatientDetailModal = ({ patient, onClose, onEdit }) => {
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Detail Pasien</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Informasi Dasar */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.patient_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NIK
                </label>
                <p className="mt-1 text-sm text-gray-900">{patient.NIK}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Lahir
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(patient.date_of_birth).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usia
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {calculateAge(patient.date_of_birth)} tahun
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jenis Kelamin
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Golongan Darah
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.blood_type || "Tidak diketahui"}
                </p>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kontak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.phone_number || "Tidak ada"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kontak Darurat
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.emergency_contact_name || "Tidak ada"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Kontak Darurat
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.emergency_contact_phonenumber || "Tidak ada"}
                </p>
              </div>
            </div>
          </div>

          {/* Riwayat Medis */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Riwayat Medis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Riwayat Alergi
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.patient_history_of_allergies ||
                    "Tidak ada riwayat alergi"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Riwayat Penyakit
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {patient.patient_disease_history ||
                    "Tidak ada riwayat penyakit"}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          {(patient.created_by || patient.updated_by) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Audit Trail
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.created_by && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dibuat oleh
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {patient.created_by.staff_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tanggal dibuat
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(patient.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </>
                )}
                {patient.updated_by && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Diupdate oleh
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {patient.updated_by.staff_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tanggal update
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(patient.updated_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tutup
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Pasien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
