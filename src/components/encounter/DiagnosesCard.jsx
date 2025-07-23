import { useState, useEffect } from "react";
import DashboardCard from "../ui/DashboardCard";
import diagnosisService from "../../services/clinical/diagnosisService";

function formatDiagnosisDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hourStr = hours.toString().padStart(2, "0");
    return `${day} ${month} ${year} pukul ${hourStr}.${minutes} ${ampm}`;
  } catch {
    return "-";
  }
}

const DiagnosisForm = ({ encounterId, token, onDiagnosisAdded, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await diagnosisService.searchICD10(term, 10, token);
      setSearchResults(result.data || []);
    } catch (error) {
      setSearchResults([]);
      setError("Gagal mencari diagnosis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiagnosis = async () => {
    if (!selectedDiagnosis) return;

    setIsSubmitting(true);
    setError("");

    try {
      await diagnosisService.createDiagnosis(
        encounterId,
        selectedDiagnosis.code,
        token
      );

      // Reset form state
      setSearchTerm("");
      setSelectedDiagnosis(null);
      setSearchResults([]);

      // Notify parent component
      onDiagnosisAdded();
    } catch (error) {
      setError(
        error.message || "Gagal menambahkan diagnosis. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add onCancel prop to allow parent to close the form
  const handleCancel = () => {
    setSearchTerm("");
    setSelectedDiagnosis(null);
    setSearchResults([]);
    setError("");
    if (typeof onCancel === "function") onCancel();
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Tambah Diagnosis</h3>

      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cari Diagnosis ICD-10
          </label>
          <input
            type="text"
            placeholder="Masukkan kata kunci diagnosis..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500">Mencari diagnosis...</div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
            {searchResults.map((item) => (
              <div
                key={item.code}
                onClick={() => setSelectedDiagnosis(item)}
                className={`cursor-pointer px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  selectedDiagnosis?.code === item.code
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
              >
                <div className="font-medium text-gray-900">{item.code}</div>
                <div className="text-sm text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Diagnosis */}
        {selectedDiagnosis && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Diagnosis Terpilih
            </h4>
            <div className="text-sm">
              <span className="font-medium text-blue-900">
                {selectedDiagnosis.code}
              </span>
              <span className="text-gray-600 ml-2">
                - {selectedDiagnosis.name}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleAddDiagnosis}
            disabled={isSubmitting || !selectedDiagnosis}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Menyimpan..." : "Tambah Diagnosis"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DiagnosesCard = ({ encounterId, token, isDoctor }) => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (!encounterId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await diagnosisService.getDiagnosesByEncounter(
          encounterId,
          token
        );
        setDiagnoses(result || []);
      } catch (error) {
        setDiagnoses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiagnoses();
  }, [encounterId, token]);

  const handleDiagnosisAdded = () => {
    setShowForm(false);
    setIsLoading(true);
    diagnosisService
      .getDiagnosesByEncounter(encounterId, token)
      .then((result) => setDiagnoses(result || []))
      .finally(() => setIsLoading(false));
  };

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Diagnosis</h2>
          {isDoctor && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Sembunyikan Form" : "+ Tambah Diagnosis"}
            </button>
          )}
        </div>

        {showForm && (
          <DiagnosisForm
            encounterId={encounterId}
            token={token}
            onDiagnosisAdded={handleDiagnosisAdded}
            onCancel={() => setShowForm(false)}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : diagnoses.length > 0 ? (
          <div className="space-y-3">
            {diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.diagnosis_id}
                className="border-b border-gray-200 pb-3 last:border-b-0"
              >
                <div className="font-medium text-gray-900">
                  <span className="text-blue-600">{diagnosis.icd10_code}</span>
                  <span className="ml-2">- {diagnosis.diagnoses_name}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1 mb-2">
                  Didiagnosa oleh:{" "}
                  {diagnosis.medic_staff?.staff_name || diagnosis.created_by}
                </div>
                <div className="text-sm text-gray-500">
                  Waktu Diagnosa: {formatDiagnosisDate(diagnosis.diagnosed_at)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">
              Belum ada data diagnosis yang ditambahkan
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default DiagnosesCard;
