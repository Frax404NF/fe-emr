import { useEffect, useState, useCallback } from "react";
import UpdateStatusModal from "./UpdateStatusModal";
import DiagnosticForm from "../form/DiagnosticForm";
import DashboardCard from "../ui/DashboardCard";
import ResultsTable from "./ResultsTable";
import diagnosticTestApi from "../../services/clinical/diagnosticTestService";

function formatCustomDate(dateString) {
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
}

// Helper Components for Modal
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

const ResultValue = ({ column, value }) => {
  if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 underline transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Lihat File
      </a>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, index) => (
          <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm mr-1 mb-1">
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="bg-gray-100 rounded p-3 font-mono text-xs text-gray-600 overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </div>
    );
  }

  if (column === "result_notes") {
    return <span className="italic text-gray-600 leading-relaxed">{value}</span>;
  }

  if (value !== undefined && value !== null && value !== "") {
    return <span className="text-gray-800">{value}</span>;
  }

  return <span className="text-gray-400 italic">Tidak ada data</span>;
};

const DiagnosticTestsCard = ({ encounterId, token }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await diagnosticTestApi.getDiagnosticTestsByEncounter(
        encounterId,
        token
      );
      // Ensure data is an array and filter out invalid entries
      const validTests = Array.isArray(data) ? data.filter(test => test && test.test_id) : [];
      setTests(validTests);
    } catch (err) {
      setError(err.message || "Gagal mengambil data pemeriksaan penunjang");
    }
    setLoading(false);
  }, [encounterId, token]);

  // Remove blockchain polling - doctors/nurses don't need blockchain management

  useEffect(() => {
    if (encounterId && token) {
      fetchTests();
    }
  }, [fetchTests, encounterId, token]);

  // Simple success handler for UpdateStatusModal
  const handleUpdateSuccess = useCallback(() => {
    fetchTests(); // Immediate refresh
  }, [fetchTests]);

  // Simple status display for doctors/nurses - no blockchain functionality
  const getStatusDisplay = useCallback((test) => {
    if (!test || !test.test_id) {
      return {
        badge: (
          <span className="px-2 py-1 rounded text-xs font-bold bg-gray-400 text-black">
            UNKNOWN
          </span>
        )
      };
    }
    
    // Simple status display without blockchain features
    const statusColors = {
      REQUESTED: "bg-yellow-400",
      IN_PROGRESS: "bg-blue-400", 
      COMPLETED: "bg-orange-400",
      RESULT_VERIFIED: "bg-green-400"
    };
    
    const displayText = {
      REQUESTED: "REQUESTED",
      IN_PROGRESS: "IN PROGRESS",
      COMPLETED: "COMPLETED", 
      RESULT_VERIFIED: "RESULT VERIFIED"
    };
    
    return {
      badge: (
        <span 
          className={`px-2 py-1 rounded text-xs text-black ${statusColors[test.status] || "bg-gray-400"}`}
        >
          {displayText[test.status] || test.status}
        </span>
      )
    };
  }, []);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailResults, setDetailResults] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // State for update status modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  return (
    <DashboardCard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pemeriksaan Penunjang</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Sembunyikan Form" : "+ Tambah Pemeriksaan"}
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
              tests.filter(test => test && test.test_id).map((test) => (
                <div
                  key={test.test_id}
                  className="mb-6 border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">
                          {test.test_name}
                        </span>
                        {test.test_type && (
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            {test.test_type}
                          </span>
                        )}
                        {getStatusDisplay(test).badge}
                      </div>
                      <div className="mt-1 text-sm text-black">
                        <span className="font-bold">Diajukan oleh:</span>{" "}
                        {test.requested_staff?.staff_name || "-"}{" "}
                      </div>
                      {test.processed_staff && (
                        <div className="mt-1 text-sm text-black">
                          <span className="font-bold">Diproses oleh:</span>{" "}
                          {test.processed_staff?.staff_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <>
                    <div
                      className={
                        test.results
                          ? "bg-white rounded-lg shadow border border-gray-200 p-4 mt-4"
                          : "bg-white rounded-lg shadow border border-gray-200 p-4 mt-4 flex items-center justify-center"
                      }
                    >
                      {test.results ? (
                        <ResultsTable results={test.results} />
                      ) : (
                        <span className="text-gray-500">Belum ada hasil</span>
                      )}
                    </div>
                    {/* Kolom aksi di bawah card hasil, selalu tampil */}
                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition"
                        onClick={() => {
                          setSelectedTest(test);
                          setShowUpdateModal(true);
                        }}
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
                    <div className="mt-2 text-sm text-gray-600">
                      Catatan: {test.result_notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">
                  Belum ada data pemeriksaan penunjang
                </p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Modal Detail Hasil Pemeriksaan */}
        {showDetailModal && detailResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Detail Hasil Pemeriksaan
                  </h3>
                  {(detailResults.type || detailResults.test_type) && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200">
                      {detailResults.type || detailResults.test_type}
                    </span>
                  )}
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  onClick={() => setShowDetailModal(false)}
                  aria-label="Tutup"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Informasi Waktu Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Informasi Pemeriksaan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoItem
                        label="Pelaksana Pemeriksaan"
                        value={detailResults.processed_staff?.staff_name}
                      />
                      <InfoItem
                        label="Waktu Request"
                        value={formatCustomDate(detailResults.requested_at)}
                      />
                      <InfoItem
                        label="Waktu Dimulai"
                        value={detailResults.processed_at ? formatCustomDate(detailResults.processed_at) : null}
                      />
                      <InfoItem
                        label="Waktu Selesai"
                        value={detailResults.completed_at ? formatCustomDate(detailResults.completed_at) : null}
                      />
                    </div>
                  </div>

                  {/* Hasil Pemeriksaan Section */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Hasil Pemeriksaan
                      </h4>
                    </div>

                    {detailResults.results ? (
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Object.keys(detailResults.results).map((col, index) => (
                              <tr key={col} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-6 py-4 font-medium text-gray-700 w-1/3 align-top">
                                  <div className="capitalize font-semibold">
                                    {col.replace(/_/g, " ")}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-800 w-2/3">
                                  <ResultValue column={col} value={detailResults.results[col]} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="px-6 py-12 text-center">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">Belum ada hasil pemeriksaan</p>
                      </div>
                    )}
                  </div>

                  {/* Catatan Section */}
                  {detailResults.result_notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Catatan
                      </h4>
                      <p className="text-yellow-700 text-sm italic">
                        {detailResults.result_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Update Status Pemeriksaan */}
        {showUpdateModal && selectedTest && (
          <UpdateStatusModal
            test={selectedTest}
            token={token}
            onClose={() => setShowUpdateModal(false)}
            onSuccess={(updatedTest) => {
              setShowUpdateModal(false);
              handleUpdateSuccess(updatedTest);
            }}
          />
        )}

      </div>
    </DashboardCard>
  );
};

export default DiagnosticTestsCard;