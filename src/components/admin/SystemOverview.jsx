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
      {/* System Statistics */}
      <DashboardCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">System Statistics</h2>
            <button
              onClick={() => {
                fetchDashboardStats();
                fetchSystemHealth();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading system statistics...
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalEncounters || 0}</div>
                <div className="text-sm text-blue-800">Total Encounters</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalTests || 0}</div>
                <div className="text-sm text-green-800">Diagnostic Tests</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.totalStaff || 0}</div>
                <div className="text-sm text-purple-800">Staff Members</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.statusDistribution?.RESULT_VERIFIED || 0}
                </div>
                <div className="text-sm text-orange-800">Verified Results</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No system statistics available
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Test Status Distribution */}
      {stats?.statusDistribution && (
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Test Status Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-gray-700">
                  {stats.statusDistribution.REQUESTED || 0}
                </div>
                <div className="text-xs text-gray-600">Requested</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-blue-700">
                  {stats.statusDistribution.IN_PROGRESS || 0}
                </div>
                <div className="text-xs text-blue-600">In Progress</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-yellow-700">
                  {stats.statusDistribution.COMPLETED || 0}
                </div>
                <div className="text-xs text-yellow-600">Completed</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-green-700">
                  {stats.statusDistribution.RESULT_VERIFIED || 0}
                </div>
                <div className="text-xs text-green-600">Verified</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* System Health */}
      {systemHealth && (
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">System Health Monitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">Database</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.services?.database?.status === 'healthy' 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-sm text-gray-600">
                  Status: <span className="font-medium capitalize">
                    {systemHealth.services?.database?.status || 'Unknown'}
                  </span>
                </div>
                {systemHealth.services?.database?.responseTime && (
                  <div className="text-sm text-gray-600">
                    Response Time: <span className="font-medium">
                      {systemHealth.services.database.responseTime}ms
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">Blockchain</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.services?.blockchain?.status === 'healthy'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-sm text-gray-600">
                  Status: <span className="font-medium capitalize">
                    {systemHealth.services?.blockchain?.status || 'Unknown'}
                  </span>
                </div>
                {systemHealth.services?.blockchain && (
                  <>
                    <div className="text-sm text-gray-600">
                      Network: <span className="font-medium">
                        {systemHealth.services.blockchain.network}
                      </span>
                    </div>
                    {systemHealth.services.blockchain.responseTime && (
                      <div className="text-sm text-gray-600">
                        Response Time: <span className="font-medium">
                          {systemHealth.services.blockchain.responseTime}ms
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Overall Status: <span className={`font-medium capitalize ${
                  systemHealth.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {systemHealth.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last Check: {formatDate(systemHealth.timestamp)}
              </div>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <DashboardCard>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-blue-700">
                  {stats.recentActivity.testsLast24h || 0}
                </div>
                <div className="text-sm text-blue-600">Tests (Last 24h)</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-green-700">
                  {stats.blockchain?.verifiedTests || 0}
                </div>
                <div className="text-sm text-green-600">Blockchain Verified</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-purple-700">
                  {stats.blockchain?.isAvailable ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-purple-600">Blockchain Status</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
};

export default SystemOverview;