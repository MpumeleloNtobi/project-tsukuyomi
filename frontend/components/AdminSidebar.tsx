"use client";

import { Store, UserCog, PackageSearch, BarChart2, Home } from "lucide-react";
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
    title: "Home",
    url: "/admin/home",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/set-user-roles",
    icon: UserCog,
  },
  {
    title: "Stores",
    url: "/admin/stores",
    icon: Store,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-sm px-4 pt-4 pb-2 mb-4">
            Admin
          </SidebarGroupLabel>
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
                            ? "bg-gray-200 text-black font-semibold"
                            : "text-gray-600 hover:bg-gray-100")
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
