import Navbar from '../components/ui/Navbar';

/**
 * NakesDashboardLayout - Layout untuk medical staff (doctors/nurses)
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
const NakesDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default NakesDashboardLayout;
