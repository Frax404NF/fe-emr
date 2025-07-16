import { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../ui/DashboardCard';
import treatmentApi from '../../services/clinical/treatmentService';
import TreatmentsForm from '../form/TreatmentsForm';

// Date formatter: "07 Juli 2025, 19:34"
const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hour}:${minute}`;
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Detail Terapi/Prosedur</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Jenis Terapi/Prosedur</h4>
              <p className="mt-1">{treatment.treatment_type || treatment.type || '-'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Waktu</h4>
              <p className="mt-1">{formatDateTime(treatment.administered_at)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Staff</h4>
              <p className="mt-1">{treatment.medic_staff?.staff_name || '-'}</p>
            </div>
            {Object.keys(details).map((key) => (
              <div key={key}>
                <h4 className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}</h4>
                <p className="mt-1 whitespace-pre-line text-gray-800 bg-gray-50 p-3 rounded-md">{details[key] || '-'}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
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