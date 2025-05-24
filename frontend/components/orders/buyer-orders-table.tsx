"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  Ban,
  CheckCircle,
  Clock,
  Package,
  Printer,
  Download,
  Send,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  AlertCircle,
  ChevronLeft,
  Car,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import type { OrderStatus, Order } from "@/types/orders";

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, isLoaded: isUserLoaded } = useUser();
  const buyerId= user?.id;

  useEffect(() => {
    if (isUserLoaded && buyerId) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/buyer/${buyerId}`,
          );
          if (!res.ok) throw new Error("Failed to fetch orders");
          const data = await res.json();
          setOrders(data || []);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to load orders");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else if (isUserLoaded && !buyerId) {
      setLoading(false);
      setError("No store associated with this account");
    }
  }, [isUserLoaded, buyerId]);

  const handlePrintOrder = () => {
    window.print();
  };

  const getStatusSteps = () => {
    if (!selectedOrder) return null;

    const isPickup = selectedOrder.deliveryMethod === "Pickup";

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
      ...(isPickup
        ? [
            {
              status: "Ready for Pickup",
              label: "Ready for Pickup",
              icon: <MapPin className="h-4 w-4" />,
            },
            {
              status: "Picked Up",
              label: "Picked Up",
              icon: <CheckCircle className="h-4 w-4" />,
            },
          ]
        : [
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
          ]),
    ];

    const current = steps.findIndex(
      (step) => step.status === selectedOrder.status,
    );

    return (
      <div>
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center rounded-full h-8 w-8 ${
                index <= current && selectedOrder.status !== "Cancelled"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.icon}
            </div>
            <div>
              <p
                className={`font-medium ${
                  index <= current && selectedOrder.status !== "Cancelled"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}

        {selectedOrder.status === "Cancelled" && (
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
  const getStatusBadge = (status: string) => {
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
      case "Ready for Pickup":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 font-medium">
            <MapPin className="mr-1 h-3 w-3" />
            Ready for Pickup
          </Badge>
        );
      case "Picked Up":
        return (
          <Badge className="bg-green-100 text-green-800 font-medium">
            <CheckCircle className="mr-1 h-3 w-3" />
            Picked Up
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
          >
            Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 font-medium"
          >
            Pending
          </Badge>
        );
      case "Refunded":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 font-medium"
          >
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const pickupStatuses: OrderStatus[] = [
    "Seller Received",
    "In progress",
    "Ready for Pickup",
    "Picked Up",
    "Cancelled",
  ];

  const deliveryStatuses: OrderStatus[] = [
    "Seller Received",
    "In progress",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm mt-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="flex justify-center py-8">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-red-500">{error}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.order_id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleViewOrder(order)}
                >
                  <TableCell className="font-medium">
                    #{order.order_id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.buyerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(order.created_at)}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.deliveryMethod}
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(order.status)}</TableCell>

                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.total_price)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          {selectedOrder ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 mr-2"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  Order #{selectedOrder.order_id.substring(0, 8)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* General Details & Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      Order Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">
                        Placed on {formatDate(selectedOrder.created_at)}
                      </p>
                      {getStatusBadge(selectedOrder.status)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrintOrder}
                      >
                        <Printer className="h-4 w-4" />
                        <span className="sr-only">Print Order</span>
                      </Button>

                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Invoice</span>
                      </Button>
                    </div>

                    <Separator className="my-4" />
                    <Label>Order Status Timeline</Label>
                    {getStatusSteps()}
                  </CardContent>
                </Card>

                {/* Order Items Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.price)} ×{item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-2">
                      <Separator className="my-2" />

                      <div className="flex justify-between font-medium">
                        <span>Total</span>

                        <span>{formatCurrency(selectedOrder.total_price)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedOrder.buyerName}
                      </p>
                      {selectedOrder.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {selectedOrder.email}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedOrder.phoneNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      Delivery Details
                      <div className="space-y-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-2 w-fit"
                        >
                          {selectedOrder.deliveryMethod}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrder.deliveryMethod === "Delivery" && (
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p>
                              {selectedOrder.streetNumber}{" "}
                              {selectedOrder.streetName}
                            </p>
                            <p>
                              {selectedOrder.town},{selectedOrder.city}
                            </p>
                            <p>{selectedOrder.postalCode}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.deliveryMethod === "Pickup" && (
                      <div className="space-y-2">
                        <Label>Pickup Information</Label>
                        <p className="text-sm text-muted-foreground">
                          Customer will pick up the order from your store.
                        </p>
                        {/* You might want to add your store's pickup address here if available */}
                        {/* Example:
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p>Your Store Address Line 1</p>
                            <p>Your Store Address Line 2</p>
                          </div>
                        </div>
                        */}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      Payment Information{" "}
                      {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrder.paymentId && (
                      <div className="space-y-2">
                        <Label>Payment ID</Label>
                        <p className="text-sm font-mono">
                          {selectedOrder.paymentId.substring(0, 12)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
