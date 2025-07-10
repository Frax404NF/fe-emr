import { useState, useCallback, useMemo } from "react";
import {
  usePatients,
  usePatientSearch,
} from "../hooks/usePatients";
import { useAuth } from "../hooks/useAuth";
import patientService from "../services/patientService";

const PatientManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showingSearch, setShowingSearch] = useState(false);

  const { currentUser } = useAuth();
  const { patients, pagination, loading, error, refreshPatients, goToPage } = usePatients();
  const { searchResults, isSearching, searchPatients, clearSearch } = usePatientSearch();

  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      setShowingSearch(true);
      await searchPatients(term);
    } else {
      setShowingSearch(false);
      clearSearch();
    }
  }, [searchPatients, clearSearch]);

  const handleDeletePatient = useCallback(async (patientId, patientName) => {
    if (window.confirm(`Yakin ingin mengarsipkan pasien ${patientName}?`)) {
      try {
        await patientService.deletePatient(patientId);
        refreshPatients();
        alert("Pasien berhasil diarsipkan");
      } catch (error) {
        alert("Gagal mengarsipkan pasien: " + error.message);
      }
    }
  }, [refreshPatients]);

  const handleViewPatient = useCallback((patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setShowingSearch(false);
    clearSearch();
  }, [clearSearch]);

  const displayPatients = useMemo(() => 
    showingSearch ? searchResults : patients
  , [showingSearch, searchResults, patients]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manajemen Pasien
        </h2>
      </div>

      {/* Daftar Pasien */}
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
        onClearSearch={handleClearSearch}
      />

      {/* Modal */}
      {showModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => {
            setShowModal(false);
            setSelectedPatient(null);
          }}
          onEdit={(patient) => {
            console.log("Edit patient:", patient);
          }}
        />
      )}
    </div>
  );
};

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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <>
      {/* Search Box */}
      <SearchInput 
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearch={onSearch}
      />

      {/* Search Info */}
      {showingSearch && (
        <SearchInfo 
          patients={patients}
          searchTerm={searchTerm}
          onClearSearch={onClearSearch}
        />
      )}

      {/* Patient Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>NIK</TableHeader>
              <TableHeader>Nama</TableHeader>
              <TableHeader>Tanggal Lahir</TableHeader>
              <TableHeader>Jenis Kelamin</TableHeader>
              <TableHeader>Aksi</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <PatientRow
                key={patient.patient_id}
                patient={patient}
                currentUserRole={currentUserRole}
                onViewPatient={onViewPatient}
                onDeletePatient={onDeletePatient}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {patients.length === 0 && !loading && (
        <EmptyState showingSearch={showingSearch} searchTerm={searchTerm} />
      )}

      {/* Pagination */}
      {!showingSearch && pagination.totalPages > 1 && (
        <Pagination 
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Memuat data pasien...</span>
  </div>
);

const ErrorDisplay = ({ error }) => (
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

const SearchInput = ({ searchTerm, isSearching, onSearch }) => (
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
);

const SearchInfo = ({ patients, searchTerm, onClearSearch }) => (
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
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const PatientRow = ({ patient, currentUserRole, onViewPatient, onDeletePatient }) => (
  <tr className="hover:bg-gray-50">
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
      {currentUserRole !== "NURSE" && (
        <button
          onClick={() => onDeletePatient(patient.patient_id, patient.patient_name)}
          className="text-red-600 hover:text-red-900"
        >
          Arsipkan
        </button>
      )}
    </td>
  </tr>
);

const EmptyState = ({ showingSearch, searchTerm }) => (
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
);

const Pagination = ({ pagination, onPageChange }) => (
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
          Menampilkan <span className="font-medium">
            {(pagination.page - 1) * pagination.limit + 1}
          </span> sampai <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span> dari <span className="font-medium">{pagination.total}</span> pasien
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
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNumber === pagination.page
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
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
);

const PatientDetailModal = ({ patient, onClose, onEdit }) => {
  // ... (kode asli yang sama untuk modal detail pasien)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-gray-800">Detail Pasien</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="NIK" value={patient.NIK} />
              <DetailItem label="Nama Lengkap" value={patient.patient_name} />
              <DetailItem 
                label="Tanggal Lahir" 
                value={new Date(patient.date_of_birth).toLocaleDateString('id-ID')} 
              />
              <DetailItem 
                label="Jenis Kelamin" 
                value={patient.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} 
              />
              <DetailItem label="Alamat" value={patient.address} />
              <DetailItem label="Nomor Telepon" value={patient.phone_number} />
              <DetailItem label="Email" value={patient.email} />
              <DetailItem label="Golongan Darah" value={patient.blood_type} />
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Riwayat Medis</h4>
              <p className="text-gray-600">{patient.medical_history || 'Tidak ada riwayat medis'}</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

export default PatientManagement;