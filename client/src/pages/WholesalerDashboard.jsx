import React from 'react';

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

export default WholesalerDashboard;