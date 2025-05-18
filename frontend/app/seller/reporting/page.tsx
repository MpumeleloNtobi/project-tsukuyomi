"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SellerReportingPage() {
  const { user } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const downloadCSV = async () => {
    if (!storeId) {
      setError("Store ID not found. Please log in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${storeId}/csv`
      );

      if (!response.ok) {
        if (response.status === 204) {
          setError("No pending orders in the last 24 hours.");
          setLoading(false);
          return;
        }
        throw new Error(`Failed to download CSV: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "daily-tasks-report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to download CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Daily Task List</h1>

      <div
        onClick={downloadCSV}
        className="cursor-pointer p-6 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Generating report...
          </>
        ) : (
          <span className="text-lg font-semibold text-blue-700">
            Download Daily Tasks Report (CSV)
          </span>
        )}
      </div>

      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </div>
  );
}
