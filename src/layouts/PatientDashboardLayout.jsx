import Navbar from "../components/Navbar";

const PatientDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-200">
      <Navbar role="patient" />
      <main className="p-4 text-black">{children}</main>
    </div>
  );
};

export default PatientDashboardLayout;
