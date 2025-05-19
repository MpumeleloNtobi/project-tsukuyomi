'use client';

import { BarChart2, Store, ClipboardList, Archive, PieChart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Dashboard',
    url: '/seller/dashboard',
    icon: BarChart2,
  },
  {
    title: 'My Store',
    url: '/seller/store',
    icon: Store,
  },
  {
    title: 'View Orders',
    url: '/seller/orders',
    icon: ClipboardList,
  },
  {
    title: 'View Inventory',
    url: '/seller/inventory',
    icon: Archive,
  },
  {
    title: 'Reporting',
    url: '/seller/reporting',
    icon: PieChart,
  },
];

export function SellerSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="bg-gray-900 shadow-md">
          <SidebarGroupLabel className="font-semibold text-lg sm:text-xl px-6 py-4 text-cyan-100 tracking-wide">
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
                            ? 'bg-gray-200 text-black font-semibold'
                            : 'text-gray-600 hover:bg-gray-100')
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
