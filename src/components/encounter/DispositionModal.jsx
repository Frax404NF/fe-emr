import { useState } from 'react';
import { getStatusConfig } from '../../utils/encounterUtils';

const DispositionModal = ({
  isOpen,
  onClose,
  onConfirm,
  newStatus,
  currentUser,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    discharge_summary: '',
    follow_up_instructions: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.discharge_summary.trim()) {
      newErrors.discharge_summary = 'Discharge summary wajib diisi';
    } else if (formData.discharge_summary.length > 2000) {
      newErrors.discharge_summary = 'Discharge summary tidak boleh lebih dari 2000 karakter';
    }

    if (formData.follow_up_instructions && formData.follow_up_instructions.length > 1000) {
      newErrors.follow_up_instructions = 'Follow-up instructions tidak boleh lebih dari 1000 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dispositionData = {
      discharge_summary: formData.discharge_summary.trim(),
      follow_up_instructions: formData.follow_up_instructions.trim() || null,
      authorized_by: currentUser?.staff_id
    };


    onConfirm(newStatus, dispositionData);
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        discharge_summary: '',
        follow_up_instructions: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  const statusConfig = getStatusConfig(newStatus);
  const isDischarge = newStatus === 'DISCHARGED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Konfirmasi {statusConfig.displayName}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Anda akan mengubah status encounter menjadi <strong>{statusConfig.displayName}</strong>. 
                  Silakan lengkapi informasi disposition di bawah ini.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rangkuman kondisi pasien saat disposisi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="discharge_summary"
              value={formData.discharge_summary}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                errors.discharge_summary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={isDischarge 
                ? "Rangkuman kondisi pasien saat keluar, diagnosis akhir, pengobatan yang diberikan, dan kondisi umum pasien..."
                : "Rangkuman kondisi pasien, diagnosis, rencana pengobatan selama rawat inap, dan instruksi khusus..."
              }
              disabled={loading}
            />
            {errors.discharge_summary && (
              <p className="text-red-500 text-sm mt-1">{errors.discharge_summary}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.discharge_summary.length}/2000 karakter
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instruksi tindak lanjut
            </label>
            <textarea
              name="follow_up_instructions"
              value={formData.follow_up_instructions}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                errors.follow_up_instructions ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={isDischarge
                ? "Instruksi perawatan di rumah, jadwal kontrol, obat yang harus dilanjutkan, aktivitas yang boleh dilakukan..."
                : "Instruksi perawatan selama rawat inap, pemeriksaan lanjutan yang diperlukan, pantauan khusus..."
              }
              disabled={loading}
            />
            {errors.follow_up_instructions && (
              <p className="text-red-500 text-sm mt-1">{errors.follow_up_instructions}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.follow_up_instructions.length}/1000 karakter
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>
                {loading ? 'Memproses...' : `Konfirmasi ${statusConfig.displayName}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispositionModal;