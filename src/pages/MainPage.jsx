import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Jika user sudah login, redirect ke dashboard sesuai role
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'DOCTOR') {
        navigate('/dokter-view');
      } else if (currentUser.role === 'NURSE') {
        navigate('/nurse-view');
      } else if (currentUser.role === 'ADMIN') {
        navigate('/admin-view');
      } else {
        // Jika role tidak dikenali, redirect ke login
        navigate('/login');
      }
    } else {
      // Jika tidak ada user, redirect ke login
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Loading state sementara proses redirect
  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Mengarahkan ke dashboard...</p>
      </div>
    </div>
  );
};

export default MainPage;
