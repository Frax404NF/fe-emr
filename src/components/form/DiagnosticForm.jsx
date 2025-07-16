import { useState } from "react";
import envConfig from '../../config/env';

const TEST_TYPES = [
  { value: "LAB", label: "Laboratorium" },
  { value: "RADIOLOGY", label: "Radiologi" },
  { value: "ECG", label: "EKG" },
  { value: "USG", label: "USG" },
  { value: "OTHER", label: "Lainnya" },
];

const validateForm = (formData) => {
  const errors = {};
  if (!formData.test_type) {
    errors.test_type = "Jenis tes wajib dipilih";
  }
  if (!formData.test_name || formData.test_name.trim().length < 3) {
    errors.test_name = "Nama tes minimal 3 karakter";
  }
  const validTypes = TEST_TYPES.map((t) => t.value);
  if (!validTypes.includes(formData.test_type)) {
    errors.test_type = "Jenis tes tidak valid";
  }
  return errors;
};

const DiagnosticForm = ({ encounterId, token, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    test_type: "",
    test_name: "",
    status: "REQUESTED",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const apiUrl = `${envConfig.API_BASE_URL}/encounters/${encounterId}/diagnostic-tests`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          setErrors(result.errors || {});
          setApiError(result.message || "Validasi gagal");
        } else if (response.status === 401) {
          setApiError("Token tidak valid, silakan login ulang.");
        } else if (response.status === 404) {
          setApiError("Encounter tidak ditemukan.");
        } else {
          setApiError("Terjadi kesalahan server.");
        }
        setLoading(false);
        return;
      }
      // Success
      setLoading(false);
      if (onSuccess) onSuccess(result.data);
      setFormData({ test_type: "", test_name: "", status: "REQUESTED" });
      if (onClose) onClose();
    } catch (error) { 
      setApiError("Koneksi bermasalah, coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Tambah Pemeriksaan Penunjang</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Tes <span className="text-red-500">*</span></label>
            <select
              name="test_type"
              value={formData.test_type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.test_type ? "border-red-500" : "border-gray-300"}`}
              required
            >
              <option value="">Pilih jenis tes</option>
              {TEST_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.test_type && <p className="text-red-500 text-xs mt-1">{errors.test_type}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tes <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.test_name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Contoh: X-Ray Thorax"
              required
            />
            {errors.test_name && <p className="text-red-500 text-xs mt-1">{errors.test_name}</p>}
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Memproses..." : "Simpan"}
          </button>
        </div>
        {apiError && <div className="text-red-500 text-sm mt-2">{apiError}</div>}
      </form>
    </div>
  );
};

export default DiagnosticForm;
