import Header from "@/components/Header";
import { OrdersTable } from "@/components/orders/buyer-orders-table";
import { OrdersHeader } from "@/components/orders/orders-header";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <>
    <Header showCart={false} />
    <div className="gap-6 p-6">
      <OrdersHeader />
      <OrdersTable />
      <div className="flex justify-center mt-8">
        <Link href={"/home"}>
        <Button className="flex items-center gap-2">
          <Store />
          Back to shopping
        </Button>
        </Link>
      </div>
    </div>
    </>
  );
}
