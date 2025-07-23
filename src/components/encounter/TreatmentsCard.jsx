import { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../ui/DashboardCard';
import treatmentApi from '../../services/clinical/treatmentService';
import TreatmentsForm from '../form/TreatmentsForm';

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hourStr = hours.toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hourStr}:${minutes} ${ampm}`;
  } catch {
    return "-";
  }
};

const TreatmentTable = ({ treatment, onViewDetail }) => {
  // Fungsi untuk memotong teks panjang
  const truncateText = (text, max = 40) => {
    if (!text) return "-";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };
  const details = treatment.treatments_details || treatment.details || {};
  const detailKeys = Object.keys(details);
  
  // Kolom dinamis dari detailKeys
  const columns = [
    { key: 'treatment_type', label: 'Jenis Terapi/Prosedur' },
    { key: 'administered_at', label: 'Waktu' },
    ...detailKeys.map(key => ({
      key,
      label: key.replace(/_/g, ' ')
               .replace(/\b\w/g, l => l.toUpperCase())
    })),
    { key: 'medic_staff', label: 'Staff' },
    { key: 'detail', label: 'Detail' }
  ];

  return (
    <div className="mb-6 overflow-hidden border rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={
                    col.key === 'detail'
                      ? 'px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                      : 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  }
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              {columns.map(col => {
                if (col.key === 'administered_at') {
                  return (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(treatment.administered_at)}
                    </td>
                  );
                }
                if (col.key === 'medic_staff') {
                  return (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {treatment.medic_staff?.staff_name || '-'}
                    </td>
                  );
                }
                if (col.key === 'treatment_type') {
                  return (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {treatment.treatment_type || treatment.type || '-'}
                    </td>
                  );
                }
                if (col.key === 'detail') {
                  return (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <button
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-xs"
                        onClick={() => onViewDetail && onViewDetail(treatment)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  );
                }
                return (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-900 max-w-[160px] truncate" title={details[col.key] || ''}>
                    {truncateText(details[col.key])}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TreatmentDetailModal = ({ open, onClose, treatment }) => {
  if (!open || !treatment) return null;
  
  const details = treatment.treatments_details || treatment.details || {};

  // Helper component for consistent info display
  const InfoItem = ({ label, value }) => (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-600">{label}:</div>
      <div className="text-sm text-gray-800">
        {value || <span className="italic text-gray-400">Belum tersedia</span>}
      </div>
    </div>
  );

  // Value rendering with type detection
  const DetailValue = ({ value }) => {
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Lihat File
        </a>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm mr-1 mb-1">
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="bg-gray-100 rounded p-3 font-mono text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span>{value}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Detail Terapi/Prosedur</h3>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200">
              {treatment.treatment_type || treatment.type || '-'}
            </span>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={onClose}
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Informasi Terapi Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Informasi Terapi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  label="Jenis Terapi/Prosedur" 
                  value={treatment.treatment_type || treatment.type || '-'} 
                />
                <InfoItem 
                  label="Waktu Pelaksanaan" 
                  value={formatDateTime(treatment.administered_at)} 
                />
                <InfoItem 
                  label="Diberikan oleh" 
                  value={treatment.medic_staff?.staff_name || '-'} 
                />
              </div>
            </div>

            {/* Detail Terapi Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  Detail Terapi
                </h4>
              </div>
              
              {Object.keys(details).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(details).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-6 py-4 font-medium text-gray-700 w-1/3 align-top">
                            <div className="capitalize font-semibold">
                              {key.replace(/_/g, " ")}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-800 w-2/3">
                            <DetailValue value={value} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Belum ada detail terapi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TreatmentsCard = ({ encounterId, token }) => {
  const [treatments, setTreatments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailModal, setDetailModal] = useState({ open: false, treatment: null });

  const fetchTreatments = useCallback(async () => {
    if (!encounterId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await treatmentApi.getTreatmentsByEncounter(encounterId, token);
      setTreatments(response?.data || []);
    } catch (error) {
      setError(error.message || 'Gagal memuat data terapi');
      setTreatments([]);
    } finally {
      setIsLoading(false);
    }
  }, [encounterId, token]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  const handleAddTreatment = async (treatmentData) => {
    try {
      const response = await treatmentApi.createTreatment(encounterId, treatmentData, token);
      const newTreatment = response.data || response;
      setTreatments(prev => [newTreatment, ...prev]);
      setShowForm(false);
      return true;
    } catch (error) {
      return error.response?.data?.message || error.message || 'Gagal menyimpan terapi';
    }
  };

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pemberian Terapi, Prosedur, Tindakan</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Sembunyikan Form' : '+ Tambah Terapi'}
          </button>
        </div>

        {showForm && (
          <TreatmentsForm
            encounterId={encounterId}
            onSave={handleAddTreatment}
            onCancel={() => setShowForm(false)}
            token={token}
          />
        )}

        <TreatmentDetailModal
          open={detailModal.open}
          onClose={() => setDetailModal({ open: false, treatment: null })}
          treatment={detailModal.treatment}
        />
        {isLoading ? (
          <div className="space-y-6 py-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="border rounded-lg">
                  <div className="h-10 bg-gray-100 border-b"></div>
                  <div className="h-16 bg-white"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchTreatments}
              className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              Coba Lagi
            </button>
          </div>
        ) : treatments.length > 0 ? (
          <div className="space-y-6">
            {treatments.map((treatment, idx) => (
              <TreatmentTable
                key={treatment.id || treatment.treatment_id || idx}
                treatment={treatment}
                onViewDetail={t => setDetailModal({ open: true, treatment: t })}
              />
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Belum ada data terapi</p>
            </div>
          )
        )}
      </div>
    </DashboardCard>
  );
};

export default TreatmentsCard;