"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FileText, Boxes, DollarSign, Loader2 } from "lucide-react";

export default function SellerReportingPage() {
  const { user } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined;

  // individual loading states
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [error, setError] = useState("");

  const downloadDailyTasksCSV = async () => {
    if (!storeId) {
      setError("Store ID not found. Please log in.");
      return;
    }

    setError("");
    setLoadingTasks(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${storeId}/csv`
      );
      if (!res.ok) {
        if (res.status === 204) {
          setError("No pending orders in the last 24 hours.");
          return;
        }
        throw new Error(`Failed: ${res.statusText}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "daily-tasks-report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to download tasks report");
    } finally {
      setLoadingTasks(false);
    }
  };

  const downloadInventoryCSV = async () => {
  if (!storeId) {
    setError("Store ID not found. Please log in.");
    return;
  }

  setError("");
  setLoadingInventory(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reporting/inventory/${storeId}`
    );
    if (!res.ok) throw new Error(`Failed: ${res.statusText}`);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    setError(err.message || "Failed to download inventory report");
  } finally {
    setLoadingInventory(false);
  }
};

  const downloadDailySalesCSV = async () => {
    if (!storeId) {
      setError("Store ID not found. Please log in.");
      return;
    }

    setError("");
    setLoadingSales(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reporting/${storeId}/daily-sales.csv`
      );
      if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "daily-sales-report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to download sales report");
    } finally {
      setLoadingSales(false);
    }
  };
  const [hovered, setHovered] = useState<string | null>(null);
   const tileClasses = (key: string) =>
    `flex-1 cursor-pointer p-8 border rounded-2xl shadow transition-all flex items-center justify-between bg-white/60 backdrop-blur-md hover:bg-white hover:shadow-xl hover:-translate-y-1 ${
      hovered === key ? "ring-2 ring-offset-2 ring-pink-500" : ""
    }`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Reporting
      </h1>
      <h2 className="font-medium mb-10 text-center">
        Generate a csv of any one of the following for administritave purposes!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daily Tasks Report */}
        <div
          onMouseEnter={() => setHovered("tasks")}
          onMouseLeave={() => setHovered(null)}
          onClick={downloadDailyTasksCSV}
          className={tileClasses("tasks")}
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6" /> Daily Tasks
            </h2>
            <p className="text-gray-600">CSV of pending orders/tasks in last 24h.</p>
          </div>
          {loadingTasks && <Loader2 className="animate-spin text-pink-600" />}
        </div>

        {/* Inventory Report */}
        <div
          onMouseEnter={() => setHovered("inventory")}
          onMouseLeave={() => setHovered(null)}
          onClick={downloadInventoryCSV}
          className={tileClasses("inventory")}
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Boxes className="w-6 h-6" /> Inventory
            </h2>
            <p className="text-gray-600">CSV of all products & stock levels.</p>
          </div>
          {loadingInventory && <Loader2 className="animate-spin text-pink-600" />}
        </div>

        {/* Daily Sales Report */}
        <div
          onMouseEnter={() => setHovered("sales")}
          onMouseLeave={() => setHovered(null)}
          onClick={downloadDailySalesCSV}
          className={tileClasses("sales")}
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <DollarSign className="w-6 h-6" /> Daily Sales
            </h2>
            <p className="text-gray-600">CSV of daily sales for last 30 days.</p>
          </div>
          {loadingSales && <Loader2 className="animate-spin text-pink-600" />}
        </div>
      </div>

      {error && (
        <p className="mt-8 text-center text-red-600 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}
