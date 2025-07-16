import { useState, useEffect } from 'react';

const TREATMENT_TYPES = [
  { value: 'INJECTION', label: 'Injeksi' },
  { value: 'IV_FLUID', label: 'Infus' },
  { value: 'MEDICATION', label: 'Obat Oral' },
  { value: 'MEDICATION_IV', label: 'Obat IV' },
  { value: 'MONITORING', label: 'Monitoring' },
  { value: 'OXYGEN', label: 'Oksigen' },
  { value: 'NEBULIZATION', label: 'Nebulisasi' },
  { value: 'RESUSCITATION', label: 'Resusitasi' },
  { value: 'CPR', label: 'CPR' },
  { value: 'DEFIBRILLATION', label: 'Defibrilasi' },
  { value: 'BLOOD_TRANSFUSION', label: 'Transfusi Darah' },
  { value: 'BLEEDING_CONTROL', label: 'Kontrol Perdarahan' },
  { value: 'CATHETERIZATION', label: 'Pemasangan Kateter' },
  { value: 'NGT_INSERTION', label: 'Pemasangan NGT' },
  { value: 'VENTILATOR', label: 'Ventilator' },
  { value: 'OTHER', label: 'Lainnya' }
];

const TREATMENT_PRESETS = {
  INJECTION: [
    { key: 'drug', label: 'Drug', type: 'text' },
    { key: 'dose', label: 'Dose', type: 'text' },
    { key: 'route', label: 'Route', type: 'text' },
    { key: 'frequency', label: 'Frequency', type: 'text' },
    { key: 'indication', label: 'Indication', type: 'text' }
  ],
  IV_FLUID: [
    { key: 'rate', label: 'Rate (ml/jam)', type: 'text' },
    { key: 'fluid', label: 'Fluid', type: 'text' },
    { key: 'volume', label: 'Volume (ml)', type: 'number' }
  ],
  MEDICATION: [
    { key: 'drug', label: 'Obat', type: 'text' },
    { key: 'dose', label: 'Dosis', type: 'text' },
    { key: 'frequency', label: 'Frekuensi', type: 'text' }
  ],
  MEDICATION_IV: [
    { key: 'drug', label: 'Obat', type: 'text' },
    { key: 'dose', label: 'Dosis', type: 'text' },
    { key: 'rate', label: 'Rate (ml/jam)', type: 'text' }
  ],
  MONITORING: [
    { key: 'parameters', label: 'Parameter yang Dimonitor', type: 'text', placeholder: 'Contoh: heart_rate, blood_pressure, urine_output' },
    { key: 'interval', label: 'Interval Monitoring', type: 'text', placeholder: 'Contoh: 15 menit' }
  ],
  OXYGEN: [
    { key: 'method', label: 'Metode', type: 'text' },
    { key: 'flow_rate', label: 'Flow Rate (L/min)', type: 'number' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  NEBULIZATION: [
    { key: 'drug', label: 'Obat', type: 'text' },
    { key: 'dose', label: 'Dosis', type: 'text' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  RESUSCITATION: [
    { key: 'method', label: 'Metode', type: 'text' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  CPR: [
    { key: 'cycles', label: 'Jumlah Siklus', type: 'number' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  DEFIBRILLATION: [
    { key: 'energy', label: 'Energi (Joule)', type: 'number' },
    { key: 'cycles', label: 'Jumlah Siklus', type: 'number' }
  ],
  BLOOD_TRANSFUSION: [
    { key: 'blood_type', label: 'Golongan Darah', type: 'text' },
    { key: 'volume', label: 'Volume (ml)', type: 'number' },
    { key: 'rate', label: 'Rate (ml/jam)', type: 'text' }
  ],
  BLEEDING_CONTROL: [
    { key: 'method', label: 'Metode', type: 'text' },
    { key: 'location', label: 'Lokasi', type: 'text' }
  ],
  CATHETERIZATION: [
    { key: 'type', label: 'Tipe Kateter', type: 'text' },
    { key: 'size', label: 'Ukuran', type: 'text' }
  ],
  NGT_INSERTION: [
    { key: 'size', label: 'Ukuran', type: 'text' },
    { key: 'volume', label: 'Volume (ml)', type: 'number' }
  ],
  VENTILATOR: [
    { key: 'mode', label: 'Mode', type: 'text' },
    { key: 'tidal_volume', label: 'Tidal Volume (ml)', type: 'number' },
    { key: 'rate', label: 'Rate', type: 'number' }
  ],
  OTHER: []
};

const TreatmentsForm = ({ onSave, onCancel }) => {
  const [treatmentType, setTreatmentType] = useState('');
  const [administeredAt, setAdministeredAt] = useState('');
  const [details, setDetails] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [newCustomField, setNewCustomField] = useState({ key: '', label: '', type: 'text' });
  const [showCustomFieldForm, setShowCustomFieldForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [presetFields, setPresetFields] = useState([]);

  useEffect(() => {
    setPresetFields(treatmentType ? TREATMENT_PRESETS[treatmentType] || [] : []);
    // Reset details when treatment type changes
    setDetails({});
  }, [treatmentType]);

  const handleDetailChange = (e) => {
    const { name, value, type } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const addCustomField = () => {
    if (!newCustomField.key || !newCustomField.label) {
      alert('Key dan Label harus diisi');
      return;
    }
    
    const allKeys = [
      ...customFields.map(f => f.key),
      ...presetFields.map(f => f.key),
      ...Object.keys(details)
    ];
    
    if (allKeys.includes(newCustomField.key)) {
      alert('Key sudah digunakan');
      return;
    }
    
    setCustomFields(prev => [...prev, newCustomField]);
    setNewCustomField({ key: '', label: '', type: 'text' });
    setShowCustomFieldForm(false);
  };

  const removeCustomField = (keyToRemove) => {
    setCustomFields(prev => prev.filter(field => field.key !== keyToRemove));
    setDetails(prev => {
      const newData = { ...prev };
      delete newData[keyToRemove];
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!treatmentType || !administeredAt) {
      alert('Jenis terapi dan waktu harus diisi');
      setIsSubmitting(false);
      return;
    }

    // Format administeredAt to ISO string
    const formattedAdministeredAt = administeredAt.endsWith('Z') 
      ? administeredAt 
      : `${administeredAt}:00Z`;

    const filledDetails = {};
    [...presetFields, ...customFields].forEach(field => {
      const value = details[field.key];
      if (value !== null && value !== undefined && value !== '') {
        filledDetails[field.key] = value;
      }
    });

    const payload = {
      treatment_type: treatmentType,
      administered_at: formattedAdministeredAt,
      treatments_details: filledDetails
    };

    try {
      await onSave(payload);
    } catch (error) {
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Tambah Terapi</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Terapi <span className="text-red-500">*</span>
            </label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih jenis terapi</option>
              {TREATMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Pemberian <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={administeredAt}
              onChange={(e) => setAdministeredAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Detail Terapi
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {presetFields.map(field => (
              <div key={field.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.key}
                  value={details[field.key] || ''}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.placeholder || field.label}
                />
              </div>
            ))}

            {customFields.map(field => (
              <div key={field.key} className="space-y-1 relative">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="flex">
                  <input
                    type={field.type}
                    name={field.key}
                    value={details[field.key] || ''}
                    onChange={handleDetailChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.label}
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomField(field.key)}
                    className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
                    title="Hapus field"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showCustomFieldForm ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h4 className="text-md font-medium text-gray-800 mb-3">
                Tambah Field Kustom
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomField.key}
                    onChange={(e) => setNewCustomField(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="contoh: catatan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomField.label}
                    onChange={(e) => setNewCustomField(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="contoh: catatan tambahan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Input
                  </label>
                  <select
                    value={newCustomField.type}
                    onChange={(e) => setNewCustomField(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomFieldForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Tambah Field
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowCustomFieldForm(true)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 border border-blue-300"
              >
                + Tambah Field Kustom
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreatmentsForm;