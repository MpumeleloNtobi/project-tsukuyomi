"use client";

import {
  BarChart2,
  Store,
  ClipboardList,
  Archive,
  PieChart,
  PackageIcon,
  Truck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/seller/dashboard",
    icon: BarChart2,
  },
  {
    title: "My Store",
    url: "/seller/store",
    icon: Store,
  },
  {
    title: "My Orders",
    url: "/seller/orders",
    icon: ClipboardList,
  },
  {
    title: "Inventory & products",
    url: "/seller/products",
    icon: PackageIcon,
  },
  {
    title: "Reporting",
    url: "/seller/reporting",
    icon: PieChart,
  },
  {
    title: "Delivery Options",
    url: "/seller/delivery-options",
    icon: Truck,
  },
];

export function SellerSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="space-x-2 px-4 py-2 rounded-md bg-gray-950 to-45%">
            <SidebarGroupLabel className="font-semibold text-lg sm:text-xl py-4 text-white">
              Seller
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={
                          `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ` +
                          (isActive
                            ? "bg-gray-800 text-white font-semibold"
                            : "text-gray-600 hover:bg-pink-800")
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
