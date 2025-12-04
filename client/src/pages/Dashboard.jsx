import React from 'react';
// IMPORT THE REAL AUTH HOOK: Assuming AuthContext is located at client/src/context/AuthContext.jsx
// FIX: Added explicit .jsx extension for robust resolution
import { useAuth } from '../context/AuthContext.jsx'; 

// --- 1. Role-Specific Dashboard Components ---

// Dashboard for Farmers (FR-5 users)
const FarmerDashboard = () => {
  return (
    <div className="p-6 bg-green-50">
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
    <div className="p-6 bg-blue-50">
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
    <div className="p-6 bg-yellow-50">
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
    <div className="p-6 bg-red-50">
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


// --- 2. Authentication Mock/Placeholder (REMOVED) ---
// We removed the mock and now use the real useAuth hook from above.


// --- 3. Main Dashboard Router (FR-2 Implementation with Logout) ---

const Dashboard = () => {
  // Use the real hook
  const { user, isLoading, logout } = useAuth();
  
  // Component to render based on role
  let ActiveDashboard = null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-500">Loading Dashboard...</h1>
      </div>
    );
  }

  // If no user or role is defined, redirect or show unauthorized message
  if (!user || !user.role) {
    // Note: In a real app, the AuthProvider/Router should handle the redirect to /login
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center text-center bg-gray-100">
        <p className="text-4xl font-extrabold text-red-600">401</p>
        <p className="text-xl text-gray-700 mt-2">Unauthorized Access</p>
        <p className="text-gray-500 mt-1">Please log in to view the dashboard.</p>
      </div>
    );
  }

  // Determine which dashboard to show
  switch (user.role.toLowerCase()) {
    case 'farmer':
      ActiveDashboard = FarmerDashboard;
      break;
    case 'wholesaler':
      ActiveDashboard = WholesalerDashboard;
      break;
    case 'transport':
      ActiveDashboard = TransportDashboard;
      break;
    case 'admin':
      ActiveDashboard = AdminDashboard;
      break;
    default:
      return (
        <div className="p-6 min-h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600">Your role ({user.role}) is not recognized by the system.</p>
        </div>
      );
  }
  
  // Render the header (with logout) and the active dashboard component
  return (
    <div className="min-h-screen bg-gray-100">
        {/* Header/Navbar for Logout and User Info */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="text-xl font-semibold text-gray-800">
                Farmer Connect - {user.role.toUpperCase()} View
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm hidden sm:inline">
                    Logged in as: <strong className="font-medium">{user.name || user.email}</strong>
                </span>
                <button
                    onClick={logout} // Attach the logout function here
                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-150 shadow-lg"
                    aria-label="Logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </header>

        {/* Dynamic Dashboard Content */}
        <main className="p-4">
            <ActiveDashboard />
        </main>
    </div>
  );
};

export default Dashboard;