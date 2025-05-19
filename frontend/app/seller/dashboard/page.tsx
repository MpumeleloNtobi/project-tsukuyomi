import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards,  kpiCardProps } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

const dashboardKPIs: kpiCardProps = {
  storeRevenue: 100000,
  totalProducts: 100,
  orders30Days: 100,
  growth30Days: 10,
}
export default function Page() {
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
  )
}
