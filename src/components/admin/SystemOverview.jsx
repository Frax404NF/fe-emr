import { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../ui/DashboardCard';
import adminService from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

const SystemOverview = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSystemHealth = useCallback(async () => {
    try {
      const response = await adminService.getSystemHealth();

      if (response.success) {
        setSystemHealth(response.data);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
      fetchSystemHealth();
    }
  }, [token, fetchDashboardStats, fetchSystemHealth]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* System Health Monitor */}
      {systemHealth && (
        <DashboardCard>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">System Health Monitor</h2>
              <button
                onClick={() => {
                  fetchDashboardStats();
                  fetchSystemHealth();
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-900 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Database</h3>
                  <div className={`w-4 h-4 rounded-full ${
                    systemHealth.services?.database?.status === 'healthy' 
                      ? 'bg-emerald-500' 
                      : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Status: <span className={`font-medium capitalize ${
                    systemHealth.services?.database?.status === 'healthy' 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {systemHealth.services?.database?.status || 'Unknown'}
                  </span>
                </div>
                {systemHealth.services?.database?.responseTime && (
                  <div className="text-sm text-gray-600">
                    Response Time: <span className="font-medium text-gray-900">
                      {systemHealth.services.database.responseTime}ms
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Blockchain</h3>
                  <div className={`w-4 h-4 rounded-full ${
                    systemHealth.services?.blockchain?.status === 'healthy'
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Status: <span className={`font-medium capitalize ${
                    systemHealth.services?.blockchain?.status === 'healthy'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}>
                    {systemHealth.services?.blockchain?.status || 'Unknown'}
                  </span>
                </div>
                {systemHealth.services?.blockchain && (
                  <>
                    <div className="text-sm text-gray-600 mb-2">
                      Network: <span className="font-medium text-gray-900">
                        {systemHealth.services.blockchain.network}
                      </span>
                    </div>
                    {systemHealth.services.blockchain.responseTime && (
                      <div className="text-sm text-gray-600">
                        Response Time: <span className="font-medium text-gray-900">
                          {systemHealth.services.blockchain.responseTime}ms
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-sm text-gray-700">
                Overall Status: <span className={`font-semibold capitalize ${
                  systemHealth.status === 'healthy' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {systemHealth.status}
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Last Check: {formatDate(systemHealth.timestamp)}
              </div>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* System Statistics */}
      <DashboardCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">System Statistics</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-gray-600">Loading system statistics...</div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-2 border-cyan-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-3xl font-bold text-gray-900 mb-3">{stats.totalTests || 0}</div>
                <div className="text-sm font-medium text-gray-600">Diagnostic Tests</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-3xl font-bold text-gray-900 mb-3">{stats.totalStaff || 0}</div>
                <div className="text-sm font-medium text-gray-600">Staff Members</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-amber-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-3xl font-bold text-gray-900 mb-3">
                  {stats.statusDistribution?.RESULT_VERIFIED || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">Verified Results</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No system statistics available
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Test Status Distribution */}
      {stats?.statusDistribution && (
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Test Status Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center hover:bg-slate-100 transition-colors duration-200">
                <div className="text-xl font-semibold text-slate-700 mb-1">
                  {stats.statusDistribution.REQUESTED || 0}
                </div>
                <div className="text-sm font-medium text-slate-600">Requested</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors duration-200">
                <div className="text-xl font-semibold text-blue-700 mb-1">
                  {stats.statusDistribution.IN_PROGRESS || 0}
                </div>
                <div className="text-sm font-medium text-blue-600">In Progress</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center hover:bg-amber-100 transition-colors duration-200">
                <div className="text-xl font-semibold text-amber-700 mb-1">
                  {stats.statusDistribution.COMPLETED || 0}
                </div>
                <div className="text-sm font-medium text-amber-600">Completed</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center hover:bg-emerald-100 transition-colors duration-200">
                <div className="text-xl font-semibold text-emerald-700 mb-1">
                  {stats.statusDistribution.RESULT_VERIFIED || 0}
                </div>
                <div className="text-sm font-medium text-emerald-600">Verified</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-cyan-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  {stats.recentActivity.testsLast24h || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">Tests (Last 24h)</div>
              </div>
              <div className="bg-white border-2 border-emerald-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  {stats.blockchain?.verifiedTests || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">Blockchain Verified</div>
              </div>
              <div className="bg-white border-2 border-amber-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    stats.blockchain?.isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className={`text-2xl font-bold mb-2 ${
                  stats.blockchain?.isAvailable ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  {stats.blockchain?.isAvailable ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm font-medium text-gray-600">Blockchain Status</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
};

export default SystemOverview;