import { useState, useEffect, useCallback } from "react";
import DashboardCard from "../ui/DashboardCard";
import adminService from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
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
      console.error("Error fetching users:", error);
      setUsers([]);
      toast.error("Failed to fetch users");
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
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID");
  };

  const getRoleColor = (role) => {
    if (!role) return "bg-slate-100 border border-slate-200 text-slate-800";
    const colors = {
      ADMIN: "bg-red-50 border border-red-200 text-red-700",
      DOCTOR: "bg-blue-50 border border-blue-200 text-blue-700",
      NURSE: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    };
    return (
      colors[role] || "bg-slate-100 border border-slate-200 text-slate-800"
    );
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
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Staff Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {userStats.total || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Total Staff
              </div>
              <div className="text-xs text-slate-500 mt-1">All Users</div>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-red-100 shadow-sm hover:shadow-md transition-all duration-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {userStats.ADMIN || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Administrators
              </div>
              <div className="text-xs text-slate-500 mt-1">System Admin</div>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {userStats.DOCTOR || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Doctors</div>
              <div className="text-xs text-slate-500 mt-1">Medical Staff</div>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {userStats.NURSE || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Nurses</div>
              <div className="text-xs text-slate-500 mt-1">Nursing Staff</div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* User Management */}
      <DashboardCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Staff Management
            </h2>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm w-full sm:w-auto focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
                title="Filter by user role"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Administrator</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
              </select>

              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-900 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Active Filter Indicator */}
          {roleFilter && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filter:</span>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium">
                Role: {roleFilter}
                <button
                  onClick={() => handleRoleFilterChange("")}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-gray-600">Loading user data...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Staff ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Specialization
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users && users.length > 0 ? (
                    users
                      .filter((user) => user && user.staff_id)
                      .map((user) => (
                        <tr
                          key={user.staff_id}
                          className="hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-gray-900 font-semibold">
                            {user.staff_id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">
                              {user.staff_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}
                            >
                              {user?.role || "UNKNOWN"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600">
                              {user.specialization || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {formatDate(user.updated_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors duration-200"
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
                      <td
                        colSpan="8"
                        className="px-6 py-8 text-center text-gray-600"
                      >
                        {loading ? "Loading..." : "No users found."}
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
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Staff Details - {selectedUser.staff_name}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* User Information */}
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-4">
                  User Information
                </h4>
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
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700">
                      {selectedUser.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                <h4 className="font-semibold text-emerald-900 mb-4">
                  Professional Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Specialization:</span>
                    <div className="font-medium">
                      {selectedUser.specialization || "Not specified"}
                    </div>
                  </div>
                  {selectedUser.role === "DOCTOR" && (
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <div className="font-medium">
                        Emergency Department (IGD)
                      </div>
                    </div>
                  )}
                  {selectedUser.role === "NURSE" && (
                    <div>
                      <span className="text-gray-600">Assignment:</span>
                      <div className="font-medium">IGD Nursing Station</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-4">
                  Account Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="font-medium">
                      {formatDate(selectedUser.created_at)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <div className="font-medium">
                      {formatDate(selectedUser.updated_at)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Status:</span>
                    <div className="font-semibold text-emerald-600">Active</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Access Level:</span>
                    <div className="font-medium">
                      {selectedUser.role === "ADMIN"
                        ? "Full System Access"
                        : selectedUser.role === "DOCTOR"
                          ? "Clinical Access"
                          : "Nursing Access"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
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

export default UserManagement;
