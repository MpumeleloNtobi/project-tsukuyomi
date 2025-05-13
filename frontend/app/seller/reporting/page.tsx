'use client';

import React from 'react';

//fetches the inventory of the specified store id
const ReportingPage = () => {
  const fetchInventoryReport = async () => {
    try {
      const storeId = '06e14636-f586-4b1f-bf60-96d6742d95ef';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/reporting/inventory/${storeId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch inventory report');
      }

      const csv = await response.text();
      console.log('🧾 CSV Inventory Report:\n', csv);

      // Renders the inventory in the console
      alert('Inventory report fetched! Check the console.');
    } catch (err) {
      console.error('❌ Error fetching inventory report:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div
        onClick={fetchInventoryReport}
        className="cursor-pointer p-6 border border-gray-300 rounded-md shadow hover:shadow-lg transition"
      >
        <h2 className="text-xl font-semibold">📦 Inventory Report</h2>
        <p>Click to fetch a CSV of all products and stock levels.</p>
      </div>
    </div>
  );
};

export default ReportingPage;