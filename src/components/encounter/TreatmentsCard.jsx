
import { useState, useEffect } from 'react';
import DashboardCard from '../ui/DashboardCard';
import treatmentApi from '../../services/clinical/treatmentService';
import TreatmentsForm from '../form/TreatmentsForm';

const TreatmentsCard = ({ encounterId, token }) => {
  const [treatments, setTreatments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      if (!encounterId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await treatmentApi.getTreatmentsByEncounter(encounterId, token);
        // API returns { success, message, data: [...] }
        setTreatments(response?.data || []);
      } catch (error) {
        setTreatments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTreatments();
  }, [encounterId, token]);

  const handleAddTreatment = async (encounterId, treatmentData, token) => {
    try {
      const response = await treatmentApi.createTreatment(encounterId, treatmentData, token);
      const newTreatment = response.data || response;
      setTreatments(prev => [newTreatment, ...prev]);
      setShowForm(false);
    } catch (error) {
      alert(`Gagal menyimpan: ${error.message}`);
    }
  };

  // Render one table per treatment
  const renderTreatmentTable = (treatment, idx) => {
    // Use correct keys from backend response
    const details = treatment.treatments_details || treatment.details || {};
    const detailKeys = Object.keys(details);

    // Standard columns
    const columns = [
      { key: 'treatment_type', label: 'Jenis Terapi' },
      { key: 'administered_at', label: 'Waktu' },
      ...detailKeys.map(key => ({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      })),
      { key: 'medic_staff', label: 'Staff' }
    ];

    return (
      <div key={treatment.id || treatment.treatment_id || idx} className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] max-w-full divide-y divide-gray-200 shadow rounded-lg border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{treatment.treatment_type || treatment.type || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {treatment.administered_at ? new Date(treatment.administered_at).toLocaleString('id-ID') : '-'}
                </td>
                {detailKeys.map(key => (
                  <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {details[key] ?? '-'}
                  </td>
                ))}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {treatment.medic_staff?.staff_name || 'Tidak Diketahui'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Terapi / Treatment</h2>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(j => (
                    <div key={j} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Terapi / Treatment</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        {treatments.length > 0 ? (
          <div className="space-y-8">
            {treatments.map((treatment, idx) => renderTreatmentTable(treatment, idx))}
          </div>
        ) : (
          !showForm && (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data terapi</p>
            </div>
          )
        )}
      </div>
    </DashboardCard>
  );
};

export default TreatmentsCard;
