import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoemr from '../../components/ui/assets/logoipsum-296.svg?url';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    staff_name: '',
    role: 'NURSE',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoemr} alt="Logo EMR" width={50} height={50} />
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-800 mb-4">
          EMR BcHealth
        </h1>
        <p className="text-slate-600 text-center mb-6">
          Silakan daftar untuk mengakses sistem EMR
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Registrasi berhasil! Anda akan diarahkan ke halaman login.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="staff_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              id="staff_name"
              name="staff_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.staff_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Peran
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="DOCTOR">Dokter</option>
              <option value="NURSE">Perawat</option>
            </select>
          </div>

          {formData.role === 'DOCTOR' && (
            <div className="mb-4">
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Spesialisasi
              </label>
              <input
                id="specialization"
                name="specialization"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Daftar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
