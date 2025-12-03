import React from 'react';

// --- 1. Role-Specific Dashboard Components ---

// Dashboard for Farmers (FR-5 users)
const FarmerDashboard = () => {
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Farmer Dashboard</h1>
      <p className="text-lg text-gray-600">
        Welcome, Farmer! This is where you will manage your produce (FR-5), view orders, and check payment status.
      </p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-green-500">
        <h2 className="text-xl font-semibold text-green-600">Produce Management (FR-5 Link)</h2>
        <p className="text-gray-500">
          This section will contain the Produce Upload Form and your current inventory list.
        </p>
      </div>
    </div>
  );
};

// Dashboard for Wholesalers
const WholesalerDashboard = () => {
  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Wholesaler Dashboard</h1>
      <p className="text-lg text-gray-600">
        Welcome, Wholesaler! This dashboard focuses on viewing available produce, placing bulk orders, and tracking logistics.
      </p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-blue-500">
        <h2 className="text-xl font-semibold text-blue-600">Marketplace Access</h2>
        <p className="text-gray-500">
          You can browse and filter all produce uploads from registered farmers here.
        </p>
      </div>
    </div>
  );
};

// Dashboard for Transport Companies
const TransportDashboard = () => {
  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Transport Company Dashboard</h1>
      <p className="text-lg text-gray-600">
        Welcome, Transport Company! Your interface is for managing assigned deliveries and confirming successful logistics completion.
      </p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-600">Delivery Management</h2>
        <p className="text-gray-500">
          View pickup locations, drop-off points, and shipment manifests.
        </p>
      </div>
    </div>
  );
};

// Dashboard for Admins (RBAC management)
const AdminDashboard = () => {
  return (
    <div className="p-6 bg-red-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-600">
        Welcome, Admin! You have centralized control over users, disputes, and system settings.
      </p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-600">User Management</h2>
        <p className="text-gray-500">
          Ability to modify user roles and approve new registrations.
        </p>
      </div>
    </div>
  );
};


// --- 2. Authentication Mock/Placeholder ---

// Placeholder for a hook that would provide user data, including the role.
// In a real app, this would come from an Auth Context or Redux store.
const useAuth = () => {
  // *** PLACEHOLDER: Replace this with actual state management ***
  // For testing, you can change this role:
  const mockUser = {
    role: 'farmer', // Try changing to 'wholesaler', 'transport', or 'admin' to test
    name: 'John Doe',
  };
  return { user: mockUser, isLoading: false }; 
};
// *************************************************************


// --- 3. Main Dashboard Router (FR-2 Implementation) ---

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-500">Loading Dashboard...</h1>
      </div>
    );
  }

  // If no user or role is defined, show an unauthorized message
  if (!user || !user.role) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center text-center bg-gray-100">
        <p className="text-4xl font-extrabold text-red-600">401</p>
        <p className="text-xl text-gray-700 mt-2">Unauthorized Access</p>
        <p className="text-gray-500 mt-1">Please log in to view the dashboard.</p>
      </div>
    );
  }

  // Use a switch statement for clear role-based rendering
  switch (user.role.toLowerCase()) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'wholesaler':
      return <WholesalerDashboard />;
    case 'transport':
      return <TransportDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="p-6 min-h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600">Your role ({user.role}) is not recognized by the system.</p>
        </div>
      );
  }
};

export default Dashboard;