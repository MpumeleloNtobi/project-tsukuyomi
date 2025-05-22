import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetailsView } from "@/components/orders/order-details";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export const metadata: Metadata = {
  title: "Order Details",
  description: "View and manage order details",
};

export default function OrderPage({ params }: OrderPageProps) {
  const { orderId } = params;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/seller/orders" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
      <OrderDetailsView orderId={orderId} />
    </div>
  );
}
