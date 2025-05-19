'use client'

import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards, kpiCardProps } from "@/components/section-cards";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user } = useUser();
  const storeId = user?.publicMetadata.storeId;

  // State to hold fetched KPIs
  const [dashboardKPIs, setDashboardKPIs] = useState<kpiCardProps>({
    storeRevenue: 0,
    totalProducts: 0,
    orders30Days: 0,
    growth30Days: 0,
  });

  useEffect(() => {
    if (!storeId) return;

    async function fetchMetrics() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reporting/${storeId}/metrics`);
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await response.json();

        setDashboardKPIs({
          storeRevenue: data.revenueThisMonth,
          totalProducts: data.totalProducts,
          orders30Days: data.salesThisMonth,
          growth30Days: Number(data.revenueGrowthPercent) || 0,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }

    fetchMetrics();
  }, [storeId]);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              storeRevenue={dashboardKPIs.storeRevenue}
              totalProducts={dashboardKPIs.totalProducts}
              orders30Days={dashboardKPIs.orders30Days}
              growth30Days={dashboardKPIs.growth30Days}
            />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
