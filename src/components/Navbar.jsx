import React from "react";
import logoemr from "../assets/logoipsum-296.svg"

const Navbar = ({ role }) => {
  return (
    <header
      className="shadow-md sticky top-0 z-50"
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
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
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <h1 className="text-xl font-bold text-white">BcHealth EMR</h1>
          </div>

          {/* Tombol Navigasi berdasarkan role */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {role === "staff" && (
              <>
                <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Daftar Pasien
                </button>
                <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Profil
                </button>
              </>
            )}
            {role === "patient" && (
              <>
                <button className="bg-slate-200 text-slate-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-300 transition-colors">
                  Rekam Medis Saya
                </button>
                <button className="bg-slate-200 text-slate-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-300 transition-colors">
                  Profil
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
