import React from 'react';

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

export default AdminDashboard;