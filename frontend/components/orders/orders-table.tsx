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
  const [note, setNote] = useState("");

  const { user, isLoaded: isUserLoaded } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined;

  useEffect(() => {
    if (isUserLoaded && storeId) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/store/${storeId}`,
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
    } else if (isUserLoaded && !storeId) {
      setLoading(false);
      setError("No store associated with this account");
    }
  }, [isUserLoaded, storeId]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setOrders(
        orders.map((order) => (order.order_id === orderId ? updated : order)),
      );
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const sendNotification = async () => {
    if (!selectedOrder) return;
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
    if (!selectedOrder) return null;

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

    const current = steps.findIndex(
      (step) => step.status === selectedOrder.status,
    );

    return (
      <div className="space-y-4">
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
              {index === current && selectedOrder.status !== "Cancelled" && (
                <p className="text-sm text-muted-foreground">
                  {{
                    "Seller Received": "Order received by seller",
                    "In progress": "Preparing your order",
                    "Out for Delivery": "On the way",
                    Delivered: "Delivered to customer",
                  }[selectedOrder.status] || ""}
                </p>
              )}
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

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateOrderStatus(order.order_id, "In progress")
                          }
                          disabled={
                            order.status === "In progress" ||
                            order.status === "Delivered" ||
                            order.status === "Cancelled"
                          }
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Mark Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateOrderStatus(order.order_id, "Delivered")
                          }
                          disabled={
                            order.status === "Delivered" ||
                            order.status === "Cancelled"
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateOrderStatus(order.order_id, "Cancelled")
                          }
                          disabled={
                            order.status === "Cancelled" ||
                            order.status === "Delivered"
                          }
                          className="text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(value) =>
                          updateOrderStatus(
                            selectedOrder.order_id,
                            value as OrderStatus,
                          )
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Seller Received">
                            Seller Received
                          </SelectItem>
                          <SelectItem value="In progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Out for Delivery">
                            Out for Delivery
                          </SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

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
                      {selectedOrder.items?.map((item) => (
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
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>
                          {formatCurrency(
                            selectedOrder.items?.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0,
                            ) || 0,
                          )}
                        </span>
                      </div>

                      {selectedOrder.shipping !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Shipping
                          </span>

                          <span>{formatCurrency(selectedOrder.shipping)}</span>
                        </div>
                      )}

                      {selectedOrder.tax !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>

                          <span>{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                      )}

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
