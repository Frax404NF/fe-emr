import { useState } from 'react';

const TREATMENT_TYPES = [
  'Injeksi',
  'Infus',
  'Obat Oral',
  'Obat IV',
  'Monitoring',
  'Oksigen',
  'Nebulisasi',
  'Resusitasi',
  'CPR',
  'Defibrilasi',
  'Transfusi Darah',
  'Kontrol Perdarahan',
  'Pemasangan Kateter',
  'Pemasangan NGT',
  'Ventilator',
  'Lainnya'
];


// Preset fields per treatment type
// Added 'Monitoring' for IGD use cases (vital signs, urine, etc.)
const TREATMENT_PRESETS = {
  Monitoring: [
    { key: 'parameters', label: 'Parameter yang Dimonitor', type: 'text', placeholder: 'Contoh: heart_rate, blood_pressure, urine_output' },
    { key: 'interval', label: 'Interval Monitoring', type: 'text', placeholder: 'Contoh: 15 menit' }
  ],
  Infus: [
    { key: 'rate', label: 'Rate (ml/jam)', type: 'text' },
    { key: 'fluid', label: 'Fluid', type: 'text' },
    { key: 'volume', label: 'Volume (ml)', type: 'number' }
  ],
  Injeksi: [
    { key: 'drug', label: 'Drug', type: 'text' },
    { key: 'dose', label: 'Dose', type: 'text' },
    { key: 'route', label: 'Route', type: 'text' },
    { key: 'frequency', label: 'Frequency', type: 'text' },
    { key: 'indication', label: 'Indication', type: 'text' }
  ],
  Oksigen: [
    { key: 'method', label: 'Metode', type: 'text' },
    { key: 'flow_rate', label: 'Flow Rate (L/min)', type: 'number' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  Nebulisasi: [
    { key: 'drug', label: 'Obat', type: 'text' },
    { key: 'dose', label: 'Dosis', type: 'text' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  'Transfusi Darah': [
    { key: 'blood_type', label: 'Golongan Darah', type: 'text' },
    { key: 'volume', label: 'Volume (ml)', type: 'number' },
    { key: 'rate', label: 'Rate (ml/jam)', type: 'text' }
  ],
  'Obat Oral': [
    { key: 'drug', label: 'Obat', type: 'text' },
    { key: 'dose', label: 'Dosis', type: 'text' },
    { key: 'frequency', label: 'Frekuensi', type: 'text' }
  ],
  'Obat IV': [
    { key: 'drug', label: 'Obat', type: 'text' },
    { key: 'dose', label: 'Dosis', type: 'text' },
    { key: 'rate', label: 'Rate (ml/jam)', type: 'text' }
  ],
  Resusitasi: [
    { key: 'method', label: 'Metode', type: 'text' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  CPR: [
    { key: 'cycles', label: 'Jumlah Siklus', type: 'number' },
    { key: 'duration', label: 'Durasi (menit)', type: 'number' }
  ],
  Defibrilasi: [
    { key: 'energy', label: 'Energi (Joule)', type: 'number' },
    { key: 'cycles', label: 'Jumlah Siklus', type: 'number' }
  ],
  'Kontrol Perdarahan': [
    { key: 'method', label: 'Metode', type: 'text' },
    { key: 'location', label: 'Lokasi', type: 'text' }
  ],
  'Pemasangan Kateter': [
    { key: 'type', label: 'Tipe Kateter', type: 'text' },
    { key: 'size', label: 'Ukuran', type: 'text' }
  ],
  'Pemasangan NGT': [
    { key: 'size', label: 'Ukuran', type: 'text' },
    { key: 'volume', label: 'Volume (ml)', type: 'number' }
  ],
  Ventilator: [
    { key: 'mode', label: 'Mode', type: 'text' },
    { key: 'tidal_volume', label: 'Tidal Volume (ml)', type: 'number' },
    { key: 'rate', label: 'Rate', type: 'number' }
  ]
};

const TreatmentsForm = ({ encounterId, onSave, onCancel, token }) => {
  const [treatmentType, setTreatmentType] = useState('');
  const [administeredAt, setAdministeredAt] = useState('');
  const [details, setDetails] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [showCustomFieldForm, setShowCustomFieldForm] = useState(false);
  const [newCustomField, setNewCustomField] = useState({ key: '', label: '', type: 'text' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset details when treatmentType changes
  const presetFields = TREATMENT_PRESETS[treatmentType] || [];

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const addCustomField = () => {
    if (!newCustomField.key || !newCustomField.label) {
      alert('Key dan Label harus diisi');
      return;
    }
    if ([...customFields.map(f => f.key), ...presetFields.map(f => f.key), ...Object.keys(details)].includes(newCustomField.key)) {
      alert('Key sudah digunakan');
      return;
    }
    setCustomFields(prev => [...prev, { ...newCustomField }]);
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

    // Only include filled details
    const filledDetails = {};
    [...presetFields, ...customFields].forEach(field => {
      const value = details[field.key];
      if (value !== null && value !== undefined && value !== '') filledDetails[field.key] = value;
    });

    const payload = {
      treatment_type: treatmentType,
      treatments_details: filledDetails
    };

    console.log("Payload sent to backend:", payload);
    
    try {
      await onSave(encounterId, payload, token);
    } catch (error) {
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Tambah Terapi</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Terapi</label>
          <select
            value={treatmentType}
            onChange={e => setTreatmentType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih jenis terapi</option>
            {TREATMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Pemberian</label>
          <input
            type="datetime-local"
            value={administeredAt}
            onChange={e => setAdministeredAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Detail Terapi (JSONB)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preset fields for selected treatment type */}
            {presetFields.map(field => (
              <div key={field.key} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.key}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={field.label}
                />
              </div>
            ))}
            {/* Custom fields */}
            {customFields.map(field => (
              <div key={field.key} className="mb-3 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <div className="flex gap-2">
                  <input
                    type={field.type}
                    name={field.key}
                    onChange={handleDetailChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={field.label}
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomField(field.key)}
                    className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    title="Hapus field"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Add Custom Field Form */}
          {showCustomFieldForm && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
              <h4 className="text-md font-medium text-gray-800 mb-3">Tambah Field Kustom</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key (nama field)</label>
                  <input
                    type="text"
                    value={newCustomField.key}
                    onChange={e => setNewCustomField(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="contoh: catatan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={newCustomField.label}
                    onChange={e => setNewCustomField(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="contoh: catatan tambahan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Input</label>
                  <select
                    value={newCustomField.type}
                    onChange={e => setNewCustomField(prev => ({ ...prev, type: e.target.value }))}
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
          )}
          {!showCustomFieldForm && (
            <div className="text-center mt-2">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreatmentsForm;
