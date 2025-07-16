import { useEffect, useState, useCallback } from "react";
import DiagnosticForm from "../form/DiagnosticForm";
import DashboardCard from '../ui/DashboardCard';
import ResultsTable from "./ResultsTable";
import diagnosticTestApi from "../../services/clinical/diagnosticTestService";


function formatCustomDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const datePart = date.toLocaleDateString('id-ID', options);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${datePart}, Pukul ${hours}:${minutes} ${ampm}`;
}

const DiagnosticTestsCard = ({ encounterId, token }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await diagnosticTestApi.getDiagnosticTestsByEncounter(encounterId, token);
      setTests(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data pemeriksaan penunjang");
    }
    setLoading(false);
  }, [encounterId, token]);

  useEffect(() => {
    if (encounterId && token) {
      fetchTests();
    }
  }, [fetchTests, encounterId, token]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailResults, setDetailResults] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pemeriksaan Penunjang</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Sembunyikan Form' : '+ Tambah Pemeriksaan'}
          </button>
        </div>
        {showForm && (
          <div className="mb-6">
            <DiagnosticForm
              encounterId={encounterId}
              token={token}
              onSuccess={() => {
                setShowForm(false);
                fetchTests();
              }}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div>
            {tests && tests.length > 0 ? (
              tests.map((test) => (
                <div key={test.id || test.test_id} className="mb-6 border rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <div>
                      <span className="font-semibold">{test.name || test.test_name}</span>
                      <span className="ml-2 px-2 py-1 rounded text-xs font-bold"
                        style={{ background: test.status === "REQUESTED" ? "#facc15" : test.status === "IN_PROGRESS" ? "#38bdf8" : test.status === "COMPLETED" ? "#4ade80" : test.status === "RESULT_VERIFIED" ? "#a78bfa" : "#e5e7eb", color: "#1e293b" }}>
                        {test.status}
                      </span>
                      <div className="mt-1 text-sm text-black"><span className="font-bold">Petugas:</span> {test.medic_staff?.staff_name || "-"}</div>
                      {/* Waktu Request Pemeriksaan disembunyikan, hanya di modal detail */}
                    </div>
                  </div>
                  <>
                    <div className={test.results ? "bg-white rounded-lg shadow border border-gray-200 p-4 mt-4" : "bg-white rounded-lg shadow border border-gray-200 p-4 mt-4 flex items-center justify-center"}>
                      {test.results ? <ResultsTable results={test.results} /> : <span className="text-gray-500">Belum ada hasil</span>}
                    </div>
                    {/* Kolom aksi di bawah card hasil, selalu tampil */}
                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition"
                        onClick={() => alert(`Update status untuk test ID ${test.id || test.test_id}`)}
                      >
                        Update Status
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-200 text-black text-sm rounded shadow hover:bg-gray-300 transition"
                        onClick={() => {
                          setDetailResults(test);
                          setShowDetailModal(true);
                        }}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </>
                  {test.result_notes && (
                    <div className="mt-2 text-sm text-gray-600">Catatan: {test.result_notes}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Belum ada data pemeriksaan penunjang</p>
              </div>
            )}
          </div>
        )}
        {/* Modal Detail Hasil Pemeriksaan */}
        {showDetailModal && detailResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-x-auto max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowDetailModal(false)}
                aria-label="Tutup"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4">Detail Hasil Pemeriksaan</h3>
              {/* Info waktu detail di modal */}
              <div className="mb-4">
                <div className="text-sm text-black mb-1">
                  <span className="font-bold">Waktu Request Pemeriksaan:</span> {formatCustomDate(detailResults.requested_at)}
                </div>
                <div className="text-sm text-black mb-1">
                  <span className="font-bold">Waktu Pemeriksaan Dimulai:</span> {detailResults.processed_at ? formatCustomDate(detailResults.processed_at) : <span className="italic text-gray-500">-</span>}
                </div>
                <div className="text-sm text-black mb-1">
                  <span className="font-bold">Waktu Selesai:</span> {detailResults.completed_at ? formatCustomDate(detailResults.completed_at) : <span className="italic text-gray-500">-</span>}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-2">
                <table className="w-full">
                  <tbody>
                    {detailResults.results ? (
                      Object.keys(detailResults.results).map((col) => (
                        <tr key={col} className="border-b last:border-b-0">
                          <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50 w-1/3 align-top capitalize">
                            {col.replace(/_/g, " ")}
                          </td>
                          <td className="px-4 py-2 text-gray-800 w-2/3 break-words">
                            {typeof detailResults.results[col] === "string" && detailResults.results[col].startsWith("http") ? (
                              <a href={detailResults.results[col]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Lihat File</a>
                            ) : Array.isArray(detailResults.results[col]) ? (
                              detailResults.results[col].join(", ")
                            ) : typeof detailResults.results[col] === "object" && detailResults.results[col] !== null ? (
                              <span className="font-mono text-xs text-gray-500">{JSON.stringify(detailResults.results[col])}</span>
                            ) : col === "result_notes" ? (
                              <span className="italic text-gray-600">{detailResults.results[col]}</span>
                            ) : (
                              detailResults.results[col] !== undefined && detailResults.results[col] !== null && detailResults.results[col] !== "" ? detailResults.results[col] : "-"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={2} className="text-center text-gray-400 py-4">Belum ada hasil pemeriksaan</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {detailResults.result_notes && (
                <div className="mt-2 text-sm text-gray-600">Catatan: {detailResults.result_notes}</div>
              )}
            </div>
          </div>
        )}
        {/* Inline Form Tambah Pemeriksaan Penunjang */}
        {showForm && (
          <div className="mb-6">
            <DiagnosticForm
              encounterId={encounterId}
              token={token}
              onSuccess={() => {
                setShowForm(false);
                fetchTests();
              }}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default DiagnosticTestsCard;
