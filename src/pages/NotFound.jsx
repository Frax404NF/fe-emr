import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 text-center px-4">
      <div className="bg-white p-72 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-slate-700 mb-4">Halaman tidak ditemukan.</p>
        <Link
          to="/"
          className="px-4 py-2.5 rounded-lg bg-white border border-slate-300 shadow-sm text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors duration-200 font-semibold w-full sm:w-auto"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
