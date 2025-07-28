import { useState, useEffect, useCallback } from 'react';
import DashboardCard from '../ui/DashboardCard';
import adminService from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch users from admin API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(roleFilter);
      
      if (response.success) {
        const userData = response.data || [];
        setUsers(Array.isArray(userData) ? userData : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  // Handle role filter change
  const handleRoleFilterChange = (newRole) => {
    setRoleFilter(newRole);
  };

  // Initialize data
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getRoleColor = (role) => {
    if (!role) return 'bg-gray-100 text-gray-800';
    const colors = {
      'ADMIN': 'bg-red-100 text-red-800',
      'DOCTOR': 'bg-blue-100 text-blue-800',
      'NURSE': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };


  // Calculate statistics
  const userStats = users.reduce((acc, user) => {
    if (user && user.role) {
      acc[user.role] = (acc[user.role] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <DashboardCard>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Staff Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.total || 0}</div>
              <div className="text-sm text-blue-800">Total Staff</div>
              <div className="text-xs text-blue-600 mt-1">All Users</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{userStats.ADMIN || 0}</div>
              <div className="text-sm text-red-800">Administrators</div>
              <div className="text-xs text-red-600 mt-1">System Admin</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.DOCTOR || 0}</div>
              <div className="text-sm text-blue-800">Doctors</div>
              <div className="text-xs text-blue-600 mt-1">Medical Staff</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.NURSE || 0}</div>
              <div className="text-sm text-green-800">Nurses</div>
              <div className="text-xs text-green-600 mt-1">Nursing Staff</div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* User Management */}
      <DashboardCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">Staff Management</h2>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
                title="Filter by user role"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Administrator</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
              </select>
              
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Active Filter Indicator */}
          {roleFilter && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filter:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Role: {roleFilter}
                <button
                  onClick={() => handleRoleFilterChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading user data...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Staff ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Specialization</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Last Updated</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users && users.length > 0 ? (
                    users.filter(user => user && user.staff_id).map((user) => (
                      <tr key={user.staff_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{user.staff_id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{user.staff_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-600">{user.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                            {user?.role || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-600">
                            {user.specialization || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-3">{formatDate(user.updated_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                              onClick={() => {
                                setSelectedUser(user);
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
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        {loading ? 'Loading...' : 'No users found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardCard>


      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Staff Details - {selectedUser.staff_name}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* User Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">User Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Staff ID:</span>
                    <div className="font-medium">#{selectedUser.staff_id}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Full Name:</span>
                    <div className="font-medium">{selectedUser.staff_name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedUser.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Professional Information</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Specialization:</span>
                    <div className="font-medium">
                      {selectedUser.specialization || 'Not specified'}
                    </div>
                  </div>
                  {selectedUser.role === 'DOCTOR' && (
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <div className="font-medium">Emergency Department (IGD)</div>
                    </div>
                  )}
                  {selectedUser.role === 'NURSE' && (
                    <div>
                      <span className="text-gray-600">Assignment:</span>
                      <div className="font-medium">IGD Nursing Station</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="font-medium">{formatDate(selectedUser.created_at)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <div className="font-medium">{formatDate(selectedUser.updated_at)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Status:</span>
                    <div className="font-medium text-green-600">Active</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Access Level:</span>
                    <div className="font-medium">
                      {selectedUser.role === 'ADMIN' ? 'Full System Access' : 
                       selectedUser.role === 'DOCTOR' ? 'Clinical Access' : 'Nursing Access'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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

export default UserManagement;