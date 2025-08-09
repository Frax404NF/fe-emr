import { useState } from "react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import { Search, DatabaseScript, Refresh, Wifi, InfoCircle, Xmark, CheckCircle, WarningTriangle, OpenInWindow, LockSquare, BookStack } from "iconoir-react";
import ShieldIcon from "../ui/assets/admin/check-circle.svg?url";

const HashVerificationModal = ({ isOpen, onClose, testData }) => {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyHash = async () => {
    if (!testData?.test_id) return;

    setLoading(true);
    setError(null);

    try {
      toast.loading("Verifying hash integrity...");

      const response = await adminService.verifyHashIntegrity(testData.test_id);

      toast.dismiss();

      if (response.success) {
        setVerification(response.data);
        toast.success("Hash verification completed");
      } else {
        setError(response.message || "Verification failed");
        toast.error("Verification failed");
      }
    } catch (err) {
      toast.dismiss();
      const errorMsg = err.message || "Verification error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    return status ? "Match" : "Mismatch";
  };

  const getStatusColor = (status) => {
    return status ? "text-emerald-600" : "text-red-600";
  };

  const handleClose = () => {
    // Clear all data when modal is closed
    setVerification(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8 text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Verifikasi Integritas Hash - Test #{testData?.test_id}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            <Xmark className="w-5 h-5" />
          </button>
        </div>

        {/* Test Information */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <InfoCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Informasi Test</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ID Test:</span>
              <div className="font-medium">#{testData?.test_id}</div>
            </div>
            <div>
              <span className="text-gray-600">Jenis Test:</span>
              <div className="font-medium">{testData?.test_type}</div>
            </div>
            <div>
              <span className="text-gray-600">Pasien:</span>
              <div className="font-medium">
                {testData?.encounters?.patients?.patient_name || "Tidak Diketahui"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="font-medium">{testData?.status}</div>
            </div>
          </div>
        </div>

        {/* Verification Control */}
        <div className="bg-violet-50 border border-violet-200 p-6 rounded-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <LockSquare className="w-5 h-5 text-violet-600" />
            <h3 className="font-semibold text-violet-900">
              Verifikasi Integritas Hash
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleVerifyHash}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Refresh className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Mulai Verifikasi
                </>
              )}
            </button>
            {verification && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  verification.comparison?.all_match
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {verification.comparison?.all_match ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    VERIFIED
                  </>
                ) : (
                  <>
                    <WarningTriangle className="w-4 h-4" />
                    TAMPERING DETECTED
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Verification Results */}
        {verification && (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookStack className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Hash Comparison Results
              </h3>
            </div>

            <div className="space-y-4">
              {/* Database Hash */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <DatabaseScript className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">
                    Database Hash
                  </span>
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {verification.hashes?.stored_hash || "Not available"}
                </div>
              </div>

              {/* Regenerated Hash */}
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Refresh className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-700">
                    Regenerated Hash (Current Data)
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      verification.comparison?.stored_vs_regenerated
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {verification.comparison?.stored_vs_regenerated ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Xmark className="w-3 h-3" />
                    )}
                    {getStatusText(
                      verification.comparison?.stored_vs_regenerated
                    )}
                  </span>
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {verification.hashes?.regenerated_hash || "Not available"}
                </div>
              </div>

              {/* Blockchain Hash */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-gray-700">
                    Blockchain Hash
                  </span>
                  {verification.hashes?.blockchain_hash && (
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        verification.comparison?.stored_vs_blockchain
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {verification.comparison?.stored_vs_blockchain ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Xmark className="w-3 h-3" />
                      )}
                      {getStatusText(
                        verification.comparison?.stored_vs_blockchain
                      )}
                    </span>
                  )}
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {verification.hashes?.blockchain_hash || (
                    <span className="text-gray-500 italic">
                      Not available in blockchain
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Overall Status */}
            <div className="mt-6 p-4 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {verification.comparison?.all_match ? (
                    <img src={ShieldIcon} className="w-8 h-8" alt="Verified" />
                  ) : (
                    <WarningTriangle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div
                  className={`text-lg font-bold ${
                    verification.comparison?.all_match
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  Integritas Keseluruhan:{" "}
                  {verification.integrity_status === 'VERIFIED' ? 'TERVERIFIKASI' : 
                   verification.integrity_status === 'TAMPERING_DETECTED' ? 'TERDETEKSI MANIPULASI' : 'TIDAK DIKETAHUI'}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {verification.comparison?.all_match
                    ? "Semua hash cocok sempurna - Tidak ada manipulasi data yang terdeteksi"
                    : "Ketidakcocokan hash terdeteksi - Data mungkin telah dikompromikan"}
                </div>

                {/* Detailed Comparison Results */}
                {!verification.comparison?.all_match && (
                  <div className="mt-4 space-y-1 text-sm">
                    <div
                      className={`flex items-center gap-1 ${getStatusColor(verification.comparison?.stored_vs_regenerated)}`}
                    >
                      {verification.comparison?.stored_vs_regenerated ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Xmark className="w-3 h-3" />
                      )}
                      Database vs Current:{" "}
                      {getStatusText(
                        verification.comparison?.stored_vs_regenerated
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 ${getStatusColor(verification.comparison?.stored_vs_blockchain)}`}
                    >
                      {verification.comparison?.stored_vs_blockchain ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Xmark className="w-3 h-3" />
                      )}
                      Database vs Blockchain:{" "}
                      {getStatusText(
                        verification.comparison?.stored_vs_blockchain
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 ${getStatusColor(verification.comparison?.regenerated_vs_blockchain)}`}
                    >
                      {verification.comparison?.regenerated_vs_blockchain ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Xmark className="w-3 h-3" />
                      )}
                      Current vs Blockchain:{" "}
                      {getStatusText(
                        verification.comparison?.regenerated_vs_blockchain
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Transaction Details */}
        {verification?.blockchain_tx && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">
                Blockchain Transaction Details
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Network:</strong> Sepolia Testnet
              </div>
              <div>
                <strong>Transaction Hash:</strong> {verification.blockchain_tx}
              </div>
              <div>
                <strong>Verified At:</strong>{" "}
                {new Date(verification.verification_timestamp).toLocaleString(
                  "id-ID"
                )}
              </div>
              <div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${verification.blockchain_tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                >
                  <OpenInWindow className="w-3 h-3 mr-1" />
                  View on Etherscan
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <div className="text-red-800">
              <div className="flex items-center gap-2">
                <WarningTriangle className="w-4 h-4 text-red-600" />
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HashVerificationModal;
