const DashboardCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default DashboardCard;
