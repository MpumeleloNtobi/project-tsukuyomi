import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/components/SellerSidebar";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SellerSidebar />
      <main className="w-full">
        <Header showCart={false}/>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
