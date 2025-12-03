import React from 'react';

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

export default FarmerDashboard;