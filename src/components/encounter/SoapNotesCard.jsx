import { useState, useEffect, useCallback } from "react";
import DashboardCard from "../ui/DashboardCard";
import soapNotesApi from "../../services/clinical/soapNotesService";

const formatCustomDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const datePart = date.toLocaleDateString("id-ID", options);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${datePart}, Pukul ${hours}:${minutes} ${ampm}`;
};

const InfoItem = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-600">{label}:</div>
    <div className="text-sm text-gray-800">
      {value ? (
        <span className="bg-white px-3 py-1 rounded border border-gray-200">
          {value}
        </span>
      ) : (
        <span className="italic text-gray-400">Belum tersedia</span>
      )}
    </div>
  </div>
);

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
    const errorMsg = await onSave(
      form,
      () => setForm({ subjective: "", objective: "", assessment: "", plan: "" }),
      setFormError
    );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 relative max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Detail Catatan SOAP
            </h3>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Tutup"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Informasi Catatan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Waktu"
                  value={formatCustomDate(note.note_time)}
                />
                <InfoItem
                  label="Staff Pelaksana"
                  value={note.medic_staff?.staff_name}
                />
              </div>
            </div>

            {/* SOAP Sections */}
            <div className="space-y-5">
              {["subjective", "objective", "assessment", "plan"].map(
                (field) => (
                  <div
                    key={field}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 capitalize">
                        {field}
                      </h4>
                    </div>
                    <div className="px-6 py-4">
                      {note[field] ? (
                        <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                          {note[field]}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">
                          Tidak ada data untuk bagian ini
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
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
                {formatCustomDate(note.note_time)}
              </td>
              {["subjective", "objective", "assessment", "plan"].map(
                (field) => (
                  <td
                    key={field + "-" + (note.soap_note_id || idx)}
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
      await soapNotesApi.createSoapNote(encounterId, noteData, token);
      await fetchSoapNotes();
      resetForm();
      setShowForm(false);
      return null;
    } catch (err) {
      let msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan SOAP Note";
      if (msg === "Encounter tidak dalam status aktif") {
        msg =
          "Tidak dapat menambahkan SOAP Notes untuk kunjungan yang tidak aktif";
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