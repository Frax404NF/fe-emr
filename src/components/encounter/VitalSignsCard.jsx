import { useState, useEffect } from 'react';
  import DashboardCard from '../ui/DashboardCard';
import VitalSignsForm from '../form/VitalSignsForm';
import vitalSignsApi from '../../services/clinical/vitalSignsService';


const VitalSignsCard = ({ encounterId, token }) => {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVitalSigns = async () => {
      // Jika encounterId tidak ada, set loading false dan return
      if (!encounterId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await vitalSignsApi.getVitalSignsByEncounter(encounterId, token);
        setVitalSigns(data || []);
      } catch (error) {
        // Set data kosong jika error
        setVitalSigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitalSigns();
  }, [encounterId, token]);

  const handleAddVitalSign = async (encounterId, vitalData, token) => {
    try {
      const response = await vitalSignsApi.createVitalSign(encounterId, vitalData, token);

      // Response sesuai backend: response.data contains the new vital sign
      const newVitalSign = response.data || response;

      // Optimasi: Tambahkan data baru tanpa refetch semua
      setVitalSigns(prev => [
        {
          id: newVitalSign.vital_sign_id,
          time: newVitalSign.measurement_time,
          data: newVitalSign.vital_sign_data,
          created_by: newVitalSign.created_by,
          vital_sign_data: newVitalSign.vital_sign_data // Untuk kompatibilitas
        },
        ...prev
      ]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save vital signs:', error);
      alert(`Gagal menyimpan: ${error.message}`);
    }
  };

  // Format tanggal dan waktu yang lebih spesifik
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      // Format manual untuk mendapatkan format yang diinginkan: "12 Juli 2025, 13:15"
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    } catch (error) {
      return '-';
    }
  };

  // Definisi field mapping untuk label dan unit
  const getFieldDefinitions = () => {
    return {
      // Primary vitals
      systolic: { label: 'Sistolik', unit: 'mmHg' },
      diastolic: { label: 'Diastolik', unit: 'mmHg' },
      heart_rate: { label: 'Heart Rate', unit: 'BPM' },
      temperature: { label: 'Suhu', unit: '°C' },
      respiratory_rate: { label: 'RR', unit: '/min' },
      oxygen_saturation: { label: 'SpO2', unit: '%' },

      // Additional vitals
      pain_scale: { label: 'Skala Nyeri', unit: '/10' },
      gcs: { label: 'GCS', unit: '' },
      height: { label: 'Tinggi', unit: 'cm' },
      weight: { label: 'Berat', unit: 'kg' },
      bmi: { label: 'BMI', unit: 'kg/m²' },
      blood_glucose: { label: 'Gula Darah', unit: 'mg/dL' }
    };
  };

  // Buat kolom dinamis dari semua data vital signs
  const getDynamicColumns = (allVitalSigns) => {
    const columns = new Set();
    const fieldDefs = getFieldDefinitions();
    
    allVitalSigns.forEach(vital => {
      const vsData = vital.vital_sign_data || vital.data || vital;
      
      // Tambahkan field standar yang ada nilai
      Object.keys(vsData).forEach(key => {
        if (key !== 'custom_fields' && vsData[key] !== null && vsData[key] !== undefined && vsData[key] !== '') {
          columns.add(key);
        }
      });
      
      // Tambahkan custom fields
      const customFields = vsData.custom_fields || {};
      Object.keys(customFields).forEach(key => {
        columns.add(`custom_${key}`);
      });
    });
    
    return Array.from(columns).map(col => {
      if (col.startsWith('custom_')) {
        const originalKey = col.replace('custom_', '');
        return {
          key: col,
          label: originalKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          unit: ''
        };
      } else {
        return {
          key: col,
          label: fieldDefs[col]?.label || col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          unit: fieldDefs[col]?.unit || ''
        };
      }
    });
  };

  // Render table row untuk setiap vital sign
  const renderTableRow = (vital, columns) => {
    const vsData = vital.vital_sign_data || vital.data || vital;
    const customFields = vsData.custom_fields || {};
    
    return columns.map((col, index) => {
      let value = '-';
      
      if (col.key.startsWith('custom_')) {
        const originalKey = col.key.replace('custom_', '');
        value = customFields[originalKey] || '-';
      } else {
        value = vsData[col.key] || '-';
      }
      
      return (
        <td key={`${col.key}-${index}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          {value !== '-' ? `${value}${col.unit ? ` ${col.unit}` : ''}` : '-'}
        </td>
      );
    });
  };

  // Render vital signs dalam format table
  const renderVitalSignsTable = () => {
    if (vitalSigns.length === 0) return null;
    
    const columns = getDynamicColumns(vitalSigns);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">
                Waktu
              </th>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                  {col.unit && <span className="text-gray-400 normal-case"> ({col.unit})</span>}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vitalSigns.map((vital, index) => (
              <tr key={vital.vital_sign_id || vital.id || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 min-w-[160px]">
                  {formatDateTime(vital.time || vital.measurement_time)}
                </td>
                {renderTableRow(vital, columns)}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {/* Tampilkan nama staff jika ada, fallback ke created_by */}
                  {vital.medic_staff?.staff_name || 'Tidak Diketahui'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tanda Vital</h2>
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
          <h2 className="text-xl font-bold">Tanda Vital</h2>
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Sembunyikan Form' : '+ Tambah Data TTV'}
          </button>
        </div>

        {showForm && (
          <VitalSignsForm
            encounterId={encounterId}
            onSave={handleAddVitalSign}
            onCancel={() => setShowForm(false)}
            token={token}
            simplified={false} // Tampilkan semua field termasuk custom
          />
        )}

        {vitalSigns.length > 0 ? (
          <div className="space-y-4">
            {renderVitalSignsTable()}
          </div>
        ) : (
          !showForm && (
            <div className="text-center py-8 text-gray-500 ">
              <p>Belum ada data tanda vital</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Tambah Data Pertama
              </button>
            </div>
          )
        )}
      </div>
    </DashboardCard>
  );
};

export default VitalSignsCard;