import Navbar from "../components/ui/Navbar";

/**
 * PatientDashboardLayout - Layout untuk patient interface
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
const PatientDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-200">
      <Navbar role="patient" />
      <main className="p-4 text-black">{children}</main>
    </div>
  );
};

export default PatientDashboardLayout;
