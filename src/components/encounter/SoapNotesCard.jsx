import { useState, useEffect, useCallback } from "react";
import DashboardCard from "../ui/DashboardCard";
import soapNotesApi from "../../services/clinical/soapNotesService";

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // Get day, month, year
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();
    // Get hour and minute in 24h format
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hour}:${minute}`;
  } catch {
    return "-";
  }
};

const SoapNotesForm = ({ onSave, loading, error, onCancel }) => {
  const [form, setForm] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasContent = Object.values(form).some((v) => v.trim());
    if (!hasContent) {
      setFormError("Minimal satu field harus diisi");
      return;
    }
    setFormError(null);
    // onSave should accept setFormError as third argument
    const errorMsg = await onSave(form, () => setForm({ subjective: "", objective: "", assessment: "", plan: "" }), setFormError);
    if (errorMsg) setFormError(errorMsg);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Tambah Catatan SOAP</h3>

      {(formError || error) && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 rounded text-sm">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {["subjective", "objective", "assessment", "plan"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field}
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              rows={2}
              placeholder={`Masukkan ${field}...`}
              disabled={loading}
            />
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

const SoapNoteDetailModal = ({ open, onClose, note }) => {
  if (!open || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Detail Catatan SOAP</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Waktu</h4>
              <p className="mt-1">{formatDateTime(note.note_time)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Staff</h4>
              <p className="mt-1">{note.medic_staff?.staff_name || "-"}</p>
            </div>

            {["subjective", "objective", "assessment", "plan"].map((field) => (
              <div key={field}>
                <h4 className="text-sm font-medium text-gray-500 capitalize">
                  {field}
                </h4>
                <p className="mt-1 whitespace-pre-line text-gray-800 bg-gray-50 p-3 rounded-md">
                  {note[field] || "-"}
                </p>
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

const SoapNotesTable = ({ soapNotes, onViewDetail }) => {
  const truncateText = (text, max = 40) => {
    if (!text) return "-";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Waktu
            </th>
            {["subjective", "objective", "assessment", "plan"].map((field) => (
              <th
                key={field}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff pelaksana
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detail
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {soapNotes.map((note, idx) => (
            <tr key={note.soap_note_id || idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 min-w-[160px]">
                {formatDateTime(note.note_time)}
              </td>
              {["subjective", "objective", "assessment", "plan"].map(
                (field) => (
                  <td
                    key={field + '-' + (note.soap_note_id || idx)}
                    className="px-4 py-3 text-sm text-gray-900 max-w-[160px] truncate"
                    title={note[field] || ""}
                  >
                    {truncateText(note[field])}
                  </td>
                )
              )}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                {note.medic_staff?.staff_name || "-"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                <button
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-xs"
                  onClick={() => onViewDetail(note)}
                >
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SoapNotesCard = ({ encounterId, token }) => {
  const [showForm, setShowForm] = useState(false);
  const [soapNotes, setSoapNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [detailModal, setDetailModal] = useState({ open: false, note: null });

  const fetchSoapNotes = useCallback(async () => {
    if (!encounterId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await soapNotesApi.getSoapNotesByEncounter(
        encounterId,
        token
      );
      setSoapNotes(data || []);
    } catch (err) {
      setError(err.message || "Gagal mengambil data SOAP Notes");
    } finally {
      setLoading(false);
    }
  }, [encounterId, token]);

  useEffect(() => {
    fetchSoapNotes();
  }, [fetchSoapNotes]);

  const handleSaveSoapNote = async (noteData, resetForm, setFormError) => {
    setFormLoading(true);
    try {
      await soapNotesApi.createSoapNote(
        encounterId,
        noteData,
        token
      );
      await fetchSoapNotes(); // Ambil data terbaru dari backend
      resetForm();
      setShowForm(false);
      return null;
    } catch (err) {
      let msg = err.response?.data?.message || err.message || "Gagal menyimpan SOAP Note";
      if (msg === "Encounter tidak dalam status aktif") {
        msg = "Tidak dapat menambahkan SOAP Notes untuk kunjungan yang tidak aktif";
      }
      if (setFormError) setFormError(msg);
      return msg;
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewDetail = (note) => {
    setDetailModal({ open: true, note });
  };

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Catatan SOAP</h2>
          <button
            onClick={() => setShowForm((f) => !f)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            {showForm ? "Sembunyikan Form" : "+ Tambah Catatan"}
          </button>
        </div>

        {showForm && (
          <SoapNotesForm
            onSave={handleSaveSoapNote}
            loading={formLoading}
            onCancel={() => setShowForm(false)}
          />
        )}

        <SoapNoteDetailModal
          open={detailModal.open}
          onClose={() => setDetailModal({ open: false, note: null })}
          note={detailModal.note}
        />

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Memuat data SOAP Notes...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : soapNotes.length > 0 ? (
          <SoapNotesTable
            soapNotes={soapNotes}
            onViewDetail={handleViewDetail}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">Belum ada catatan SOAP</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default SoapNotesCard;
