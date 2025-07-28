import { useState, useEffect } from "react";
import diagnosticTestApi from "../../services/clinical/diagnosticTestService";
import staffApi from "../../services/clinical/staffService";
import toast from 'react-hot-toast';

const STATUS_FLOW = {
  REQUESTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: ["RESULT_VERIFIED"],
  RESULT_VERIFIED: []
};

const TEST_RESULT_PRESETS = {
  LAB: [
    { key: 'hemoglobin', label: 'Hemoglobin', type: 'number' },
    { key: 'leukosit', label: 'Leukosit', type: 'number' },
    { key: 'trombosit', label: 'Trombosit', type: 'number' },
    { key: 'glukosa', label: 'Glukosa', type: 'number' },
    { key: 'ureum', label: 'Ureum', type: 'number' },
    { key: 'kreatinin', label: 'Kreatinin', type: 'number' },
    { key: 'result_notes', label: 'Catatan', type: 'text' }
  ],
  RADIOLOGY: [
    { key: 'finding', label: 'Temuan', type: 'text' },
    { key: 'image_url', label: 'URL Gambar', type: 'text' },
    { key: 'technique', label: 'Teknik', type: 'text' },
    { key: 'result_notes', label: 'Catatan', type: 'text' }
  ],
  ECG: [
    { key: 'rhythm', label: 'Irama', type: 'text' },
    { key: 'rate', label: 'Rate', type: 'number' },
    { key: 'axis', label: 'Axis', type: 'text' },
    { key: 'interpretation', label: 'Interpretasi', type: 'text' },
    { key: 'file_url', label: 'File URL', type: 'text' },
    { key: 'result_notes', label: 'Catatan', type: 'text' }
  ],
  USG: [
    { key: 'organ', label: 'Organ', type: 'text' },
    { key: 'finding', label: 'Temuan', type: 'text' },
    { key: 'image_url', label: 'URL Gambar', type: 'text' },
    { key: 'measurement', label: 'Pengukuran', type: 'text' },
    { key: 'result_notes', label: 'Catatan', type: 'text' }
  ],
  OTHER: [
    { key: 'result_notes', label: 'Catatan', type: 'text' }
  ]
};

const UpdateStatusModal = ({ test, token, onClose, onSuccess }) => {
  const [nextStatus, setNextStatus] = useState("");
  const [processedBy, setProcessedBy] = useState("");
  // --- Dynamic result fields ---
  const [resultDetails, setResultDetails] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [newCustomField, setNewCustomField] = useState({ key: '', label: '', type: 'text' });
  const [showCustomFieldForm, setShowCustomFieldForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  // --- Radiology impression handler ---
  const [radiologyImpression, setRadiologyImpression] = useState('');

  // Fetch staff list when IN_PROGRESS selected
  useEffect(() => {
    if (nextStatus === "IN_PROGRESS") {
      setStaffLoading(true);
      staffApi.getStaffList(token)
        .then(data => setStaffList(data))
        .catch(() => setStaffList([]))
        .finally(() => setStaffLoading(false));
    } else {
      setStaffList([]);
    }
  }, [nextStatus, token]);

  // Reset resultDetails when test_type changes or status changes
  useEffect(() => {
    if (nextStatus === "COMPLETED") {
      setResultDetails({});
      setCustomFields([]);
    }
  }, [nextStatus, test.test_type]);

  const availableTransitions = test.available_transitions || STATUS_FLOW[test.status] || [];
  const testType = test.test_type || test.testType || 'OTHER';
  const presetFields = TEST_RESULT_PRESETS[testType] || TEST_RESULT_PRESETS.OTHER;

  const handleResultChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResultDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addCustomField = () => {
    if (!newCustomField.key || !newCustomField.label) {
      setError('Key dan Label harus diisi');
      return;
    }
    const allKeys = [
      ...customFields.map(f => f.key),
      ...presetFields.map(f => f.key),
      ...Object.keys(resultDetails)
    ];
    if (allKeys.includes(newCustomField.key)) {
      setError('Sudah ada field yang sama');
      return;
    }
    setCustomFields(prev => [...prev, newCustomField]);
    setNewCustomField({ key: '', label: '', type: 'text' });
    setShowCustomFieldForm(false);
    setError("");
  };

  const removeCustomField = (keyToRemove) => {
    setCustomFields(prev => prev.filter(field => field.key !== keyToRemove));
    setResultDetails(prev => {
      const newData = { ...prev };
      delete newData[keyToRemove];
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let updateData = { status: nextStatus };
      if (nextStatus === "IN_PROGRESS") {
        updateData.processed_by = Number(processedBy);
      }
      if (nextStatus === "COMPLETED") {
        const filledResults = {};
        [...presetFields, ...customFields].forEach(field => {
          const value = resultDetails[field.key];
          if (value !== null && value !== undefined && value !== '') {
            filledResults[field.key] = field.type === 'number' ? Number(value) : value;
          }
        });
        if (resultDetails.case_summary) filledResults.case_summary = resultDetails.case_summary;
        if (testType === 'RADIOLOGY' && radiologyImpression) filledResults.impression = radiologyImpression;
        updateData.results = filledResults;
      }
      const result = await diagnosticTestApi.updateDiagnosticTest(test.id || test.test_id, updateData, token);
      
      // ✅ Optimistic UI feedback
      if (nextStatus === "COMPLETED") {
        toast.success("✅ Test completed successfully!", { duration: 3000 });
        toast.loading("⏳ Storing results to blockchain...", { 
          duration: 5000,
          id: `blockchain-${test.id || test.test_id}` 
        });
      } else if (nextStatus === "IN_PROGRESS") {
        toast.success("📋 Test is now in progress", { duration: 3000 });
      } else if (nextStatus === "RESULT_VERIFIED") {
        toast.success("✅ Test result verified!", { duration: 3000 });
      }
      
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message || "Gagal update status");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-2xl p-6 relative overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">Update Status Pemeriksaan</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status Saat Ini</label>
            <div className="px-3 py-2 border rounded bg-gray-100">{test.status}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status Berikutnya</label>
            <select
              value={nextStatus}
              onChange={e => setNextStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Pilih status</option>
              {availableTransitions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {nextStatus === "IN_PROGRESS" && (
            <div>
              <label className="block text-sm font-medium mb-1">Petugas Pelaksana Pemeriksaan</label>
              {staffLoading ? (
                <div className="text-gray-500 text-sm">Memuat daftar petugas...</div>
              ) : (
                <select
                  value={processedBy}
                  onChange={e => setProcessedBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Pilih petugas</option>
                  {staffList.map(staff => (
                    <option key={staff.staff_id} value={staff.staff_id}>
                      {staff.staff_name} ({staff.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          {nextStatus === "COMPLETED" && (
            <div>
              <label className="block text-sm font-medium mb-1">Hasil Pemeriksaan</label>
              {/* Case Summary input for all test types */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1">Ringkasan Kasus (Case Summary)</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Ringkasan kasus, kronologi, gejala, dll."
                  value={resultDetails.case_summary || ''}
                  name="case_summary"
                  onChange={handleResultChange}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                {/* Radiology impression handler */}
                {testType === 'RADIOLOGY' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1">Impresi Radiologi</label>
                    <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Impresi/Conclusion" value={radiologyImpression} onChange={e => setRadiologyImpression(e.target.value)} />
                  </div>
                )}
                {/* Preset & custom fields */}
                {[...presetFields, ...customFields].map(field => (
                  <div key={field.key} className="space-y-1 w-full">
                    <label className="block text-xs font-medium mb-1">{field.label}</label>
                    {field.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={!!resultDetails[field.key]}
                        onChange={handleResultChange}
                        className="mr-2"
                      />
                    ) : (
                      <div className="flex w-full">
                        <input
                          type={field.type}
                          name={field.key}
                          value={resultDetails[field.key] || ''}
                          onChange={handleResultChange}
                          className="flex-1 px-3 py-2 border rounded min-w-0"
                          placeholder={field.label}
                        />
                        {customFields.some(f => f.key === field.key) && (
                          <button
                            type="button"
                            onClick={() => removeCustomField(field.key)}
                            className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
                            title="Hapus field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {showCustomFieldForm ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Tambah Field Kustom</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                    <div className="col-span-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newCustomField.key}
                        onChange={(e) => setNewCustomField(prev => ({ ...prev, key: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md min-w-0"
                        placeholder="contoh: catatan"
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newCustomField.label}
                        onChange={(e) => setNewCustomField(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md min-w-0"
                        placeholder="contoh: catatan tambahan"
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Input</label>
                      <select
                        value={newCustomField.type}
                        onChange={(e) => setNewCustomField(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md min-w-0"
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
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Memproses..." : "Update"}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
