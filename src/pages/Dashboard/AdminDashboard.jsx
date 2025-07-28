import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import NakesDashboardLayout from "../../layouts/NakesDashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";
import BlockchainManagement from "../../components/admin/BlockchainManagement";
import SystemOverview from "../../components/admin/SystemOverview";
import UserManagement from "../../components/admin/UserManagement";

// Fallback components for error handling
const FallbackComponent = ({ componentName }) => (
  <DashboardCard>
    <div className="p-6 text-center">
      <div className="text-red-500 mb-2">⚠️ Error Loading Component</div>
      <p className="text-gray-600">
        Failed to load {componentName}. Please refresh the page.
      </p>
    </div>
  </DashboardCard>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Input validation
  if (!currentUser) {
    return (
      <NakesDashboardLayout>
        <DashboardCard>
          <div className="p-6 text-center">
            <div className="text-yellow-500 mb-2">
              ⚠️ Authentication Required
            </div>
            <p className="text-gray-600">
              Please log in to access the admin dashboard.
            </p>
          </div>
        </DashboardCard>
      </NakesDashboardLayout>
    );
  }

  const tabs = [
    {
      id: "overview",
      label: "System Overview",
    },
    {
      id: "blockchain",
      label: "Blockchain Management",
    },
    {
      id: "users",
      label: "User Management",
    },
  ];

  return (
    <NakesDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <DashboardCard>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang, {currentUser?.staff_name} (ADMIN)
            </p>
          </div>
        </DashboardCard>

        {/* Navigation Tabs */}
        <DashboardCard>
          <div className="border-b border-gray-200">
            <nav
              className="flex flex-wrap gap-2 sm:gap-4 lg:gap-8 px-4 sm:px-6 overflow-x-auto"
              role="tablist"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </DashboardCard>

        {/* Tab Content with Error Boundaries */}
        {activeTab === "overview" &&
          (() => {
            try {
              return SystemOverview && typeof SystemOverview === "function" ? (
                <SystemOverview />
              ) : (
                <FallbackComponent componentName="System Overview" />
              );
            } catch (error) {
              console.error("Error rendering SystemOverview:", error);
              return <FallbackComponent componentName="System Overview" />;
            }
          })()}

        {activeTab === "blockchain" &&
          (() => {
            try {
              return BlockchainManagement &&
                typeof BlockchainManagement === "function" ? (
                <BlockchainManagement />
              ) : (
                <FallbackComponent componentName="Blockchain Management" />
              );
            } catch (error) {
              console.error("Error rendering BlockchainManagement:", error);
              return (
                <FallbackComponent componentName="Blockchain Management" />
              );
            }
          })()}

        {activeTab === "users" &&
          (() => {
            try {
              return UserManagement && typeof UserManagement === "function" ? (
                <UserManagement />
              ) : (
                <FallbackComponent componentName="User Management" />
              );
            } catch (error) {
              console.error("Error rendering UserManagement:", error);
              return <FallbackComponent componentName="User Management" />;
            }
          })()}
      </div>
    </NakesDashboardLayout>
  );
};

export default AdminDashboard;
