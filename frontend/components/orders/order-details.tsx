"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Truck,
  Clock,
  Package,
  CheckCircle,
  Ban,
  Mail,
  User,
  ShoppingBag,
  AlertCircle,
  Printer,
  Download,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/orders";

export async function OrderDetailsView({ params }) {
  const orderId = await params;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/id/${orderId}`,
        );

        if (!res.ok) {
          throw new Error("Failed to load order");
        }

        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${order.order_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setOrder(updated);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const sendNotification = async () => {
    if (!order) return;

    try {
      toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: "Sending notification to customer...",
        success: "Notification sent successfully!",
        error: "Failed to send notification",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const getStatusSteps = () => {
    const steps = [
      {
        status: "Seller Received",
        label: "Seller Received",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        status: "In progress",
        label: "In Progress",
        icon: <Package className="h-4 w-4" />,
      },
      {
        status: "Out for Delivery",
        label: "Out for Delivery",
        icon: <Truck className="h-4 w-4" />,
      },
      {
        status: "Delivered",
        label: "Delivered",
        icon: <CheckCircle className="h-4 w-4" />,
      },
    ];

    const current = steps.findIndex((step) => step.status === order?.status);

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center rounded-full h-8 w-8 ${
                index <= current && order?.status !== "Cancelled"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.icon}
            </div>
            <div>
              <p
                className={`font-medium ${
                  index <= current && order?.status !== "Cancelled"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              {index === current && order?.status !== "Cancelled" && (
                <p className="text-sm text-muted-foreground">
                  {
                    {
                      "Seller Received": "Order received by seller",
                      "In progress": "Preparing your order",
                      "Out for Delivery": "On the way",
                      Delivered: "Delivered to customer",
                    }[order?.status || ""]
                  }
                </p>
              )}
            </div>
          </div>
        ))}

        {order?.status === "Cancelled" && (
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center justify-center rounded-full h-8 w-8 bg-red-100 text-red-600">
              <Ban className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-red-600">Order Cancelled</p>
              <p className="text-sm text-muted-foreground">
                This order has been cancelled
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Seller Received":
        return (
          <Badge className="bg-amber-100 text-amber-800 font-medium">
            <Clock className="mr-1 h-3 w-3" />
            Seller Received
          </Badge>
        );
      case "In progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 font-medium">
            <Package className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case "Out for Delivery":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 font-medium">
            <Truck className="mr-1 h-3 w-3" />
            Out for Delivery
          </Badge>
        );
      case "Delivered":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 font-medium">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 font-medium">
            <Ban className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))}
                </div>

                <div className="mt-6 space-y-2">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-28" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-40 mt-1" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
        <h3 className="text-lg font-medium">Error Loading Order</h3>
        <p className="text-muted-foreground mt-1">
          {error || "Order not found"}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button
            variant="default"
            onClick={() => router.push("/seller/orders")}
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Order #{order.order_id.substring(0, 8)}
          </h2>
          <p className="text-muted-foreground mt-1">
            Placed on {formatDate(order.created_at)} •{" "}
            {getStatusBadge(order.status)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={order.status}
            onValueChange={(value) => updateOrderStatus(value as OrderStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Seller Received">Seller Received</SelectItem>
              <SelectItem value="In progress">In Progress</SelectItem>
              <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handlePrintOrder}>
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print Order</span>
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download Invoice</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {formatCurrency(
                      order.items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0,
                      ),
                    )}
                  </span>
                </div>
                {order.shipping !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(order.shipping)}</span>
                  </div>
                )}
                {order.tax !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-muted-foreground" />
                Customer Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="note">Add a note to the customer</Label>
                  <Textarea
                    id="note"
                    placeholder="Enter a message to send to the customer..."
                    className="mt-1.5"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <Button onClick={sendNotification} disabled={!note.trim()}>
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contact Information</Label>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {order.buyerName}
                  </p>
                  {order.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {order.email}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {order.phoneNumber}
                  </p>
                </div>
              </div>

              {order.deliveryMethod === "Delivery" && (
                <div className="space-y-2">
                  <Label>Delivery Address</Label>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>
                        {order.streetNumber} {order.streetName}
                      </p>
                      <p>
                        {order.town}, {order.city}
                      </p>
                      <p>{order.postalCode}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Delivery Method</Label>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 w-fit"
                >
                  <Truck className="h-4 w-4" />
                  {order.deliveryMethod}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Payment Information</Label>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status</span>
                    <Badge
                      variant={
                        order.paymentStatus === "Paid"
                          ? "success"
                          : order.paymentStatus === "Refunded"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment ID</span>
                      <span className="text-sm font-mono">
                        {order.paymentId.substring(0, 12)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>{getStatusSteps()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
