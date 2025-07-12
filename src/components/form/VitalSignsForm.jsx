// src/components/clinical/VitalSignsForm.jsx
import { useState } from 'react';

const VitalSignsForm = ({ encounterId, onSave, onCancel, token, simplified }) => {
  // Field standar untuk vital signs
  const standardFields = [
    { key: 'systolic', label: 'Sistolik', unit: 'mmHg', type: 'number', min: 60, max: 300 },
    { key: 'diastolic', label: 'Diastolik', unit: 'mmHg', type: 'number', min: 40, max: 200 },
    { key: 'heart_rate', label: 'Denyut Jantung', unit: 'bpm', type: 'number', min: 30, max: 250 },
    { key: 'temperature', label: 'Suhu', unit: '°C', type: 'number', step: "0.1", min: 30, max: 45 },
    { key: 'respiratory_rate', label: 'Laju Pernapasan', unit: '/min', type: 'number', min: 5, max: 60 },
    { key: 'oxygen_saturation', label: 'SpO2', unit: '%', type: 'number', min: 0, max: 100 },
  ];

  // Field tambahan yang sering digunakan tapi bisa dikustomisasi
  const commonAdditionalFields = [
    { key: 'pain_scale', label: 'Skala Nyeri', unit: '0-10', type: 'number', min: 0, max: 10 },
    { key: 'gcs', label: 'Glasgow Coma Scale', unit: '3-15', type: 'number', min: 3, max: 15 },
    { key: 'weight', label: 'Berat Badan', unit: 'kg', type: 'number', step: "0.1", min: 1, max: 300 },
    { key: 'height', label: 'Tinggi Badan', unit: 'cm', type: 'number', min: 30, max: 250 },
    { key: 'bmi', label: 'BMI', unit: 'kg/m²', type: 'number', step: "0.1", min: 10, max: 50 },
  ];

  const [formData, setFormData] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [showCustomFieldForm, setShowCustomFieldForm] = useState(false);
  const [newCustomField, setNewCustomField] = useState({ key: '', label: '', unit: '', type: 'text' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? (name.endsWith('_scale') ? Number(value) : value) : null
    }));
  };

  // Handler untuk menambah field custom
  const addCustomField = () => {
    if (!newCustomField.key || !newCustomField.label) {
      alert('Key dan Label harus diisi');
      return;
    }

    // Pastikan key unik
    const allKeys = [...standardFields, ...commonAdditionalFields, ...customFields].map(f => f.key);
    if (allKeys.includes(newCustomField.key)) {
      alert('Key sudah digunakan, pilih key yang berbeda');
      return;
    }

    setCustomFields(prev => [...prev, { ...newCustomField }]);
    setNewCustomField({ key: '', label: '', unit: '', type: 'text' });
    setShowCustomFieldForm(false);
  };

  // Handler untuk menghapus field custom
  const removeCustomField = (keyToRemove) => {
    setCustomFields(prev => prev.filter(field => field.key !== keyToRemove));
    // Hapus juga dari formData
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[keyToRemove];
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Filter hanya field yang diisi dan konversi ke number untuk field numerik
    const filledData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        // Konversi ke number untuk field numerik
        const numericFields = ['systolic', 'diastolic', 'heart_rate', 'temperature', 'respiratory_rate', 'oxygen_saturation', 'pain_scale', 'blood_glucose', 'weight', 'height', 'bmi', 'gcs'];
        if (numericFields.includes(key)) {
          filledData[key] = parseFloat(value);
        } else {
          filledData[key] = value;
        }
      }
    });
    
    // Validasi minimal 1 field terisi
    if (Object.keys(filledData).length === 0) {
      alert('Minimal satu tanda vital harus diisi');
      setIsSubmitting(false);
      return;
    }
    
    // Backend mengharapkan data langsung (flat structure), tidak wrapped
    // Pisahkan field yang didukung backend vs custom fields
    const supportedFields = ['systolic', 'diastolic', 'heart_rate', 'temperature', 'respiratory_rate', 'oxygen_saturation', 'pain_scale', 'gcs', 'height', 'weight'];
    
    const submittedData = {};
    const customFieldsData = {};
    
    Object.entries(filledData).forEach(([key, value]) => {
      if (supportedFields.includes(key)) {
        submittedData[key] = value;
      } else {
        // Field yang tidak didukung masuk ke custom_fields
        customFieldsData[key] = value;
      }
    });
    
    // Jika ada custom fields, tambahkan ke submittedData
    if (Object.keys(customFieldsData).length > 0) {
      submittedData.custom_fields = customFieldsData;
    }
    
    console.log('VitalSignsForm: Data sesuai backend schema:', submittedData);
    console.log('VitalSignsForm: Supported fields:', Object.keys(submittedData).filter(k => k !== 'custom_fields'));
    console.log('VitalSignsForm: Custom fields:', customFieldsData);
    console.log('VitalSignsForm: Encounter ID:', encounterId);
    
    try {
      await onSave(encounterId, submittedData, token);
    } catch (error) {
      console.error('Error saving vital signs:', error);
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4">
      <h3 className="text-lg font-medium mb-4">Tambah Tanda Vital</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Standard Fields */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Tanda Vital Standar</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardFields.map((field) => (
              <div key={field.key} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.unit && `(${field.unit})`}
                </label>
                <input
                  type={field.type}
                  name={field.key}
                  min={field.min}
                  max={field.max}
                  step={field.step || "any"}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Fields (untuk mode non-simplified) */}
        {!simplified && (
          <>
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Data TTV Tambahan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonAdditionalFields.map((field) => (
                  <div key={field.key} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.unit && `(${field.unit})`}
                    </label>
                    <input
                      type={field.type}
                      name={field.key}
                      min={field.min}
                      max={field.max}
                      step={field.step || "any"}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={field.label}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">Field Kustom</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customFields.map((field) => (
                    <div key={field.key} className="mb-3 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.unit && `(${field.unit})`}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={field.type}
                          name={field.key}
                          min={field.min}
                          max={field.max}
                          step={field.step || "any"}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder={field.label}
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomField(field.key)}
                          className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          title="Hapus field"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Field Form */}
            {showCustomFieldForm && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-3">Tambah Field Kustom</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key (nama field)
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
                      Label
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
                      Unit (opsional)
                    </label>
                    <input
                      type="text"
                      value={newCustomField.unit}
                      onChange={(e) => setNewCustomField(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="contoh: L/min"
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
                      <option value="date">Date</option>
                      <option value="time">Time</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomFieldForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Tambah Field
                  </button>
                </div>
              </div>
            )}

            {/* Button to show custom field form */}
            {!showCustomFieldForm && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowCustomFieldForm(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors border border-blue-300"
                >
                  + Tambah Field Kustom
                </button>
              </div>
            )}
          </>
        )}

        {/* Submit buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VitalSignsForm;