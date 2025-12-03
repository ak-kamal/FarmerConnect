import React from 'react';

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

export default TransportDashboard;