"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  TruckIcon,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export function OrderStats() {
  const stats = {
    total: 42,
    pending: 12,
    processing: 18,
    delivered: 8,
    cancelled: 4,
  };

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-6 md:py-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card first:ml-0 last:mr-0 mx-4">
        <CardHeader className="items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time orders</p>
        </CardContent>
      </Card>

      <Card className="@container/card first:ml-0 last:mr-0 mx-4">
        <CardHeader className="items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">Awaiting processing</p>
        </CardContent>
      </Card>

      <Card className="@container/card first:ml-0 last:mr-0 mx-4">
        <CardHeader className="items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.processing}</div>
          <p className="text-xs text-muted-foreground">In transit</p>
        </CardContent>
      </Card>

      <Card className="@container/card first:ml-0 last:mr-0 mx-4">
        <CardHeader className="items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.delivered}</div>
          <p className="text-xs text-muted-foreground">
            Successfully delivered
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
