import { useState, useEffect } from "react";
import diagnosticTestApi from "../../services/clinical/diagnosticTestService";
import staffApi from "../../services/clinical/staffService";

const STATUS_FLOW = {
  REQUESTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: ["RESULT_VERIFIED"],
  RESULT_VERIFIED: []
};

const UpdateStatusModal = ({ test, token, onClose, onSuccess }) => {
  const [nextStatus, setNextStatus] = useState("");
  const [processedBy, setProcessedBy] = useState("");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
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

  const availableTransitions = STATUS_FLOW[test.status] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let updateData = { status: nextStatus };
      if (nextStatus === "IN_PROGRESS") updateData.processed_by = Number(processedBy);
      if (nextStatus === "COMPLETED") {
        try {
          updateData.results = JSON.parse(results);
        } catch (err) {
          setError("Format hasil pemeriksaan harus JSON valid.");
          setLoading(false);
          return;
        }
      }
      await diagnosticTestApi.updateDiagnosticTest(test.id || test.test_id, updateData, token);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Gagal update status");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
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
              <label className="block text-sm font-medium mb-1">Hasil Pemeriksaan (JSON)</label>
              <textarea
                value={results}
                onChange={e => setResults(e.target.value)}
                className="w-full px-3 py-2 border rounded font-mono"
                rows={5}
                placeholder='{"hemoglobin": "14.2 g/dL", "result_notes": "Normal"}'
                required
              />
              <small className="text-gray-500">Isi sesuai format hasil test (JSON)</small>
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
