import { useEffect, useState, useCallback } from "react";
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

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pemeriksaan Penunjang</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            onClick={() => alert('Fitur tambah pemeriksaan penunjang akan segera hadir!')}
          >
            + Tambah Pemeriksaan
          </button>
        </div>
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
                    </div>
                    <div className="text-sm text-black mt-2 md:mt-0 space-y-1">
                      <div>
                        <span className="font-bold">Waktu Request Pemeriksaan:</span> {formatCustomDate(test.requested_at)}
                      </div>
                      <div>
                        <span className="font-bold">Waktu Pemeriksaan Dimulai:</span> {
                          test.status === "REQUESTED" ? (
                            <span className="italic text-gray-500">Pemeriksaan belum dimulai</span>
                          ) : test.status === "IN_PROGRESS" ? (
                            test.processed_at ? formatCustomDate(test.processed_at) : <span className="italic text-gray-500">-</span>
                          ) : test.status === "COMPLETED" ? (
                            test.processed_at ? formatCustomDate(test.processed_at) : <span className="italic text-gray-500">-</span>
                          ) : (
                            <span className="italic text-gray-500">-</span>
                          )
                        }
                      </div>
                      <div>
                        <span className="font-bold">Waktu Selesai:</span> {
                          test.status === "COMPLETED" && test.completed_at ? (
                            formatCustomDate(test.completed_at)
                          ) : test.status === "REQUESTED" ? (
                            <span className="italic text-gray-500">Pemeriksaan belum dimulai</span>
                          ) : test.status === "IN_PROGRESS" ? (
                            <span className="italic text-gray-500">Pemeriksaan sementara dilaksanakan</span>
                          ) : (
                            <span className="italic text-gray-500">-</span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  {test.results ? (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-4">
                      <ResultsTable results={test.results} />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-4 flex items-center justify-center">
                      <span>Belum ada hasil</span>
                    </div>
                  )}
                  {test.result_notes && (
                    <div className="mt-2 text-sm text-gray-600">Catatan: {test.result_notes}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400">Belum ada pemeriksaan penunjang</div>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default DiagnosticTestsCard;
