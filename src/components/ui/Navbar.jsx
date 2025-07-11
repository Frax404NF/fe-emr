import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import logoemr from './assets/logoipsum-296.svg';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchProfile = async () => {
    if (!currentUser?.access_token) {
      setProfileError('No access token available. Please login again.');
      return;
    }

    setLoadingProfile(true);
    setProfileError(null);

    try {
      const profile = await authService.getProfile(currentUser.access_token);
      setProfileData(profile);
    } catch (error) {
      if (error.response?.status === 401) {
        setProfileError('Session expired. Please login again.');
      } else {
        setProfileError(error.message || 'Failed to load profile');
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    fetchProfile();
  };

  const closeModal = () => {
    setShowProfileModal(false);
    setProfileData(null);
    setProfileError(null);
  };

  const getRoleDisplayName = role => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'DOCTOR':
        return 'Dokter';
      case 'NURSE':
        return 'Perawat';
      default:
        return role;
    }
  };

  return (
    <>
      <header
        className="shadow-md sticky top-0 z-50"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        }}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <img
                src={logoemr}
                alt="Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <h1 className="text-xl font-bold text-white">BcHealth EMR</h1>
            </div>

            {/* Tombol Navigasi berdasarkan role */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white hidden sm:block">
                    {currentUser.staff_name} (
                    {getRoleDisplayName(currentUser.role)})
                  </span>
                  <button
                    onClick={handleProfileClick}
                    className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Profil Staf
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* Modal Content */}
            <div className="p-6">
              {loadingProfile ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading profile...</span>
                </div>
              ) : profileError ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-600 mb-4">{profileError}</p>
                  <button
                    onClick={fetchProfile}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : profileData ? (
                <div className="space-y-4">
                  {/* Profile Avatar */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profileData.staff_name || currentUser.staff_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getRoleDisplayName(profileData.role || currentUser.role)}
                    </p>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">
                        {profileData.email ||
                          currentUser.email ||
                          'Not available'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Staff ID
                      </label>
                      <p className="text-gray-900">
                        {profileData.staff_id ||
                          currentUser.staff_id ||
                          'Not available'}
                      </p>
                    </div>

                    {profileData.specialization && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization
                        </label>
                        <p className="text-gray-900">
                          {profileData.specialization}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No profile data available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    handleLogout();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
