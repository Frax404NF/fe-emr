import React from "react";
import Navbar from "../components/Navbar";

const NakesDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar role="staff" />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default NakesDashboardLayout;
