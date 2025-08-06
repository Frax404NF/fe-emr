import { useState, useEffect, useCallback } from "react";
import DashboardCard from "../ui/DashboardCard";
import adminService from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const BlockchainManagement = () => {
  const { token } = useAuth();
  const [blockchainTests, setBlockchainTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTests: 0,
    totalEncounters: 0,
    statusDistribution: {
      REQUESTED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      RESULT_VERIFIED: 0,
    },
  });
  const [filter, setFilter] = useState("all");
  const [daysFilter, setDaysFilter] = useState("all");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  // Fetch blockchain tests using admin API
  const fetchBlockchainTests = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filter !== "all") {
        filters.status = filter;
      }
      if (daysFilter !== "all") {
        filters.days = daysFilter;
      }

      const response = await adminService.getBlockchainTests(filters);

      if (response.success) {
        const tests = response.data || [];
        setBlockchainTests(tests);

        // Update pagination info from response
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching blockchain tests:", error);
      setBlockchainTests([]);
    } finally {
      setLoading(false);
    }
  }, [filter, daysFilter, pagination.page, pagination.limit]);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await adminService.getDashboardStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }, []);

  // Retry blockchain verification
  const handleRetryBlockchain = async (testId) => {
    try {
      toast.loading(`Retrying blockchain verification for test ${testId}...`);

      const response = await adminService.retryBlockchainVerification(testId);

      toast.dismiss();

      if (response.success) {
        const { data } = response;

        // Handle different response types based on your backend
        switch (data.status) {
          case "ALREADY_VERIFIED":
            toast.success("Test sudah terverifikasi sebelumnya");
            break;
          case "RESULT_VERIFIED":
            toast.success("Verifikasi blockchain berhasil!");
            break;
          default:
            toast.success(
              response.message || "Blockchain verification retry initiated!"
            );
        }

        // Update selectedTest if modal is open and matches current test
        if (selectedTest && selectedTest.test_id === testId) {
          setSelectedTest(prev => ({
            ...prev,
            status: data.status || prev.status,
            result_tx_hash: data.transaction_hash || data.result_tx_hash || prev.result_tx_hash,
            blockchainVerified: data.status === "RESULT_VERIFIED" || data.blockchain_verified || prev.blockchainVerified,
            processed_at: data.processed_at || prev.processed_at
          }));
        }

        // Refresh data after retry
        setTimeout(async () => {
          await fetchBlockchainTests();
          await fetchDashboardStats();
          
          // Also refresh the selected test data if modal is still open
          if (selectedTest && selectedTest.test_id === testId) {
            try {
              const updatedTests = await adminService.getBlockchainTests({ test_id: testId });
              if (updatedTests.success && updatedTests.data.length > 0) {
                setSelectedTest(updatedTests.data[0]);
              }
            } catch (error) {
              console.error("Error refreshing selected test:", error);
            }
          }
        }, 2000);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Retry failed: ${error.message}`);
      console.error("Retry blockchain error:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    if (token) {
      fetchBlockchainTests();
      fetchDashboardStats();
    }
  }, [token, fetchBlockchainTests, fetchDashboardStats]);

  const getStatusColor = (status) => {
    return adminService.getStatusColor(status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID");
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1, // Reset to first page when changing limit
    }));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleDaysFilterChange = (newDaysFilter) => {
    setDaysFilter(newDaysFilter);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Note: Filtering and pagination now done on backend
  const filteredTests = blockchainTests;

  return (
    <div className="space-y-6">
      {/* Blockchain Statistics */}
      <DashboardCard>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Blockchain Integrity Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-cyan-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {stats.totalTests || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Tests</div>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {stats.statusDistribution?.RESULT_VERIFIED || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Blockchain Verified</div>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-amber-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {stats.statusDistribution?.COMPLETED || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Pending Verification
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Blockchain Test Management */}
      <DashboardCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Blockchain Transaction Management
            </h2>

            {/* Filters - Responsive Layout */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              {/* Status Filter */}
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
                title="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="RESULT_VERIFIED">Verified</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REQUESTED">Requested</option>
              </select>

              {/* Days Filter */}
              <select
                value={daysFilter}
                onChange={(e) => handleDaysFilterChange(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
                title="Filter by time range"
              >
                <option value="all">All Time</option>
                <option value="1">Last 24 hours</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

              <button
                onClick={() => {
                  fetchBlockchainTests();
                  fetchDashboardStats();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Active Filters Indicator */}
          {(filter !== "all" || daysFilter !== "all") && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filter !== "all" && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Status: {filter}
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {daysFilter !== "all" && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Last {daysFilter} day{daysFilter !== "1" ? "s" : ""}
                  <button
                    onClick={() => handleDaysFilterChange("all")}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  handleFilterChange("all");
                  handleDaysFilterChange("all");
                }}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200"
              >
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading blockchain data...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Test ID</th>
                    <th className="px-4 py-3 text-left">Test Type</th>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Processed At</th>
                    <th className="px-4 py-3 text-left">Blockchain Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr key={test.test_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">
                          {test.test_id}
                        </td>
                        <td className="px-4 py-3">{test.test_type}</td>
                        <td className="px-4 py-3">
                          {test.encounters?.patients?.patient_name || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}
                          >
                            {adminService.formatTestStatus(test.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(test.processed_at)}
                        </td>
                        <td className="px-4 py-3">
                          {test.status === "RESULT_VERIFIED" ||
                          test.result_tx_hash ? (
                            <span className="text-green-600 text-xs font-medium">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              {test.status === "COMPLETED"
                                ? "Pending Verification"
                                : "Not Ready"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {test.status === "COMPLETED" &&
                              !test.blockchainVerified && (
                                <button
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                                  onClick={() =>
                                    handleRetryBlockchain(test.test_id)
                                  }
                                >
                                  Retry
                                </button>
                              )}
                            <button
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                              onClick={() => {
                                setSelectedTest(test);
                                setShowDetailModal(true);
                              }}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {loading
                          ? "Loading..."
                          : "No blockchain test data available. Create encounters with diagnostic tests to see data here."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
              {/* Pagination Info */}
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Items per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Per page:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={!pagination.has_prev}
                    className="px-3 py-1 text-sm border-2 border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="px-3 py-1 text-sm border-2 border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, pagination.total_pages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.total_pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.total_pages - 2
                        ) {
                          pageNum = pagination.total_pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 text-sm border-2 rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? "bg-gradient-to-r from-blue-800 to-blue-600 text-white border-blue-600"
                                : "border-gray-200 hover:bg-slate-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="px-3 py-1 text-sm border-2 border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.total_pages)}
                    disabled={!pagination.has_next}
                    className="px-3 py-1 text-sm border-2 border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Test Detail Modal */}
      {showDetailModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Test Details - ID #{selectedTest.test_id}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-4">
                  Patient Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">
                      {selectedTest.encounters?.patients?.patient_name ||
                        "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Patient ID:</span>
                    <div className="font-medium">
                      #{selectedTest.encounters?.patient_id || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Information */}
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                <h4 className="font-semibold text-emerald-900 mb-4">
                  Test Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Test Type:</span>
                    <div className="font-medium">{selectedTest.test_type}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${adminService.getStatusColor(selectedTest.status)}`}
                    >
                      {adminService.formatTestStatus(selectedTest.status)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Requested At:</span>
                    <div className="font-medium">
                      {formatDate(selectedTest.requested_at)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Processed At:</span>
                    <div className="font-medium">
                      {formatDate(selectedTest.processed_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Information */}
              <div className="bg-violet-50 border border-violet-200 p-6 rounded-xl">
                <h4 className="font-semibold text-violet-900 mb-4">
                  Blockchain Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Verification Status:</span>
                    <div
                      className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedTest.blockchainVerified
                          ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
                          : "bg-amber-100 border border-amber-300 text-amber-800"
                      }`}
                    >
                      {selectedTest.blockchainVerified ? "Verified" : "Pending"}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600">Medical Data Hash:</span>
                    <div className="font-mono text-xs bg-slate-100 border border-slate-200 p-3 rounded-lg mt-2 break-all">
                      {selectedTest.results_hash || "Not available"}
                    </div>
                  </div>

                  {selectedTest.result_tx_hash && (
                    <div>
                      <span className="text-gray-600">Transaction Hash:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="font-mono text-xs bg-slate-100 border border-slate-200 p-3 rounded-lg flex-1 break-all">
                          {selectedTest.result_tx_hash}
                        </div>
                        <a
                          href={adminService.getEtherscanUrl(
                            selectedTest.result_tx_hash
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-blue-900 hover:to-blue-700 transition-all duration-200 shadow-sm"
                        >
                          View on Etherscan
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-4">
                  Audit Trail
                </h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Has Medical Hash:</span>
                    <span
                      className={
                        selectedTest.hasHash ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"
                      }
                    >
                      {selectedTest.hasHash ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blockchain Verified:</span>
                    <span
                      className={
                        selectedTest.blockchainVerified
                          ? "text-emerald-600 font-semibold"
                          : "text-amber-600 font-semibold"
                      }
                    >
                      {selectedTest.blockchainVerified ? "Yes" : "Pending"}
                    </span>
                  </div>
                  {selectedTest.processed_at && selectedTest.requested_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">
                        {Math.round(
                          (new Date(selectedTest.processed_at) -
                            new Date(selectedTest.requested_at)) /
                            1000
                        )}{" "}
                        seconds
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {selectedTest.status === "COMPLETED" &&
                !selectedTest.blockchainVerified && (
                  <button
                    onClick={() => {
                      handleRetryBlockchain(selectedTest.test_id);
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg font-medium hover:from-blue-900 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Retry Blockchain Verification
                  </button>
                )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainManagement;
