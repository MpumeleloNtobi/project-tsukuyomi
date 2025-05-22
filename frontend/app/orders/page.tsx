import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersHeader } from "@/components/orders/orders-header";
import { OrderStats } from "@/components/orders/order-stats";

export default function OrdersPage() {
  return (
    <div className="gap-6 p-6">
      <OrdersHeader />
      <OrderStats />
      <OrdersTable />
    </div>
  );
}
