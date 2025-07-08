/**
 * DashboardCard Component
 * 
 * Shared component untuk card layout di semua dashboard.
 * Mengurangi duplikasi CSS classes dan struktur yang sama.
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan dalam card
 * @param {string} [props.className] - Additional CSS classes
 */
const DashboardCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default DashboardCard;
