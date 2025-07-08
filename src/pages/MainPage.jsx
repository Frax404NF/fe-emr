import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-300 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <svg
            id="logo-86"
            width="50"
            height="50"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#007DFC"
              d="M25.56 11.69C23.91 10.59 21.98 10 20 10V0c3.96 0 7.82 1.17 11.11 3.37s6.96 5.32 8.48 8.98c1.51 3.65 1.91 7.69 1.14 11.57s-2.68 7.44-5.47 10.24-6.44 4.73-10.32 5.51-7.89.38-11.54-1.13c-3.65-1.52-6.79-4.08-8.99-7.37C1.17 27.82 0 23.96 0 20h10c0 1.98.59 3.91 1.69 5.56 1.1 1.64 2.67 2.92 4.5 3.68 1.83.77 3.84.97 5.78.59 1.94-.39 3.73-1.34 5.07-2.68s2.29-3.13 2.67-5.07c.38-1.94.18-3.95-.59-5.78-.77-1.83-2.04-3.4-3.68-4.5z"
            />
            <path
              fill="#007DFC"
              d="M10 0c0 1.31-.26 2.61-.76 3.83-.5 1.21-1.24 2.31-2.15 3.21-.9.91-2 1.65-3.21 2.15C2.61 9.74 1.31 10 0 10v10c2.63 0 5.23-.52 7.65-1.52 2.43-1 4.65-2.48 6.49-4.33 1.85-1.85 3.33-4.06 4.33-6.49C19.48 5.23 20 2.63 20 0H10z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">EMR BcHealth</h1>
        <p className="text-slate-600 mb-6">
          Pilih peran untuk masuk ke dashboard:
        </p>

        <div className="space-y-3">
          <Link
            to="/dokter-view"
            className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Masuk sebagai Dokter
          </Link>
          <Link
            to="/nurse-view"
            className="block w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Masuk sebagai Perawat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;