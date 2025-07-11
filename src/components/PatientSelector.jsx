import { useState, useEffect, useRef } from 'react';
import { usePatients } from '../hooks/usePatients';

/**
 * PatientSelector Component 
 * 
 * Komponen untuk memilih pasien saat membuat encounter.
 * Mendukung pencarian pasien existing.
 */
const PatientSelector = ({ selectedPatient, onPatientSelect, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  const { patients, isLoading, fetchPatients } = usePatients();

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter patients based on search term
  useEffect(() => {
    if (!patients || patients.length === 0) {
      setFilteredPatients([]);
      return;
    }

    if (searchTerm.length < 2) {
      setFilteredPatients([]);
      setIsOpen(false);
      return;
    }

    const filtered = patients.filter(patient => 
      patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.NIK?.includes(searchTerm)
    );
    
    setFilteredPatients(filtered);
    setIsOpen(filtered.length > 0);
  }, [searchTerm, patients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPatient = (patient) => {
    onPatientSelect(patient);
    setSearchTerm(patient.patient_name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear selection if user starts typing again
    if (selectedPatient && value !== selectedPatient.patient_name) {
      onPatientSelect(null);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2 && filteredPatients.length > 0) {
      setIsOpen(true);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pilih Pasien <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ketik nama pasien atau NIK (min 2 karakter)..."
          autoComplete="off"
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Selected patient indicator */}
        {selectedPatient && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Memuat pasien...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            <>
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
                Ditemukan {filteredPatients.length} pasien
              </div>
              {filteredPatients.map((patient) => (
                <div
                  key={patient.patient_id}
                  onClick={() => handleSelectPatient(patient)}
                  className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    {patient.patient_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    NIK: {patient.NIK} • {calculateAge(patient.date_of_birth)} tahun • {patient.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                  </div>
                  {patient.patient_history_of_allergies && (
                    <div className="text-xs text-red-600 mt-1">
                      ⚠️ Alergi: {patient.patient_history_of_allergies.substring(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : searchTerm.length >= 2 && !isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <p className="text-sm">Tidak ada pasien ditemukan</p>
              <p className="text-xs mt-1">Coba kata kunci lain</p>
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500">
              <p className="text-sm">Ketik minimal 2 karakter untuk mencari</p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Selected patient info */}
      {selectedPatient && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                Pasien Terpilih: {selectedPatient.patient_name}
              </p>
              <p className="text-xs text-green-600">
                ID: {selectedPatient.patient_id} • NIK: {selectedPatient.NIK}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onPatientSelect(null);
                setSearchTerm('');
              }}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-500">
        Gunakan nama pasien atau NIK untuk mencari. Ketik minimal 2 karakter.
      </p>
    </div>
  );
};

export default PatientSelector;
