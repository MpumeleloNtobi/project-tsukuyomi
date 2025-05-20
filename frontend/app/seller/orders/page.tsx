"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Order, getOrderColumns } from "./order-column"
import { DataTable } from "./order-table"
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackageCheck, Clock, Truck, PackageSearch, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
// Fix the Popover imports to use the same component library
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const orderStatuses = [
  {
    value: "Shipped",
    label: "Shipped",
  },
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Processing",
    label: "Processing",
  },
]

function SellerOrders() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [status, setStatus] = useState("all");
    const [displayed, setdisplayedOrders] = useState<Order[]>([]);
    const [updating, setUpdating] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
   
    // Count all categories locally
    const [allOrdersCount, setAllordersCount] = useState(0);
    const [pendingCount, setpendingCount] = useState(0);
    const [shippedCount, setShippedCount] = useState(0);
    const [processingCount, setProcessingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    // Store ID from user metadata
    const storeId = user?.publicMetadata?.storeId;

    
    const columns = React.useMemo(() => 
  getOrderColumns(
    (order) => {
      setSelectedOrder(order);
      setSelectedStatus(order.status);
      setDialogOpen(true);
    }
  ), 
[]);

    // Fetch orders function
    const fetchOrders = useCallback(async () => {
        if (!storeId) return;
        
        setLoading(true);
        setError(null);
        console.log('[Fetching Orders]');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${storeId}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch orders: ${response.status}`);
            }
            const data = await response.json();
            console.log('[Orders Fetched]', data);
            
            setAllOrders(data);
            setLoading(false)
        } catch (error: any) {
            setError(error.message);
            setAllOrders([]);
        } finally {
            setLoading(false);
        }
        
    }, [storeId]);

    
    const handleStatusSelect = (value: string) => {
        setSelectedStatus(value);
    };
    
    
    const handleStatusUpdate = useCallback(async () => {
      if (!selectedOrder || !selectedStatus || updating) return;
      
      try {
        setUpdating(true);
        const updatedOrder = { ...selectedOrder, status: selectedStatus };
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${updatedOrder.order_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedOrder)
        });

        if (!response.ok) {
          throw new Error('Update failed');
        }
        
        toast.success('Order updated successfully');
        
       setDialogOpen(false);
    
    
    setTimeout(() => {
      setSelectedOrder(null);
      setSelectedStatus(null);
    }, 300);
        
        // Then refetch data
        setUpdating(false);
        await fetchOrders();
      } catch (error) {
        toast.error('Failed to update order');
      } finally {
        setUpdating(false);
      }
    }, [selectedOrder, selectedStatus, updating, fetchOrders]);
    
    
    const countOrdersByStatus = useMemo(() => {
      const counts = {
        all: allOrders.length,
        Pending: 0,
        Shipped: 0,
        Processing: 0,
        Completed: 0
      };
      
      allOrders.forEach(order => {
        if (order.status && counts[order.status as keyof typeof counts] !== undefined) {
          counts[order.status as keyof typeof counts]++;
        }
      });
      
      return counts;
    }, [allOrders]);
    
    // Update count states when counts change
    useEffect(() => {
      setAllordersCount(countOrdersByStatus.all);
      setpendingCount(countOrdersByStatus.Pending);
      setShippedCount(countOrdersByStatus.Shipped);
      setProcessingCount(countOrdersByStatus.Processing);
      setCompletedCount(countOrdersByStatus.Completed);
    }, [countOrdersByStatus]);

    // Filter orders based on selected status
    const filteredOrders = useMemo(() => {
      return status === "all" 
        ? allOrders 
        : allOrders.filter(item => item.status === status);
    }, [allOrders, status]);

    // Update displayed orders when filtered orders change
    useEffect(() => {
      setdisplayedOrders(filteredOrders);
    }, [filteredOrders]);

    // Fetch orders when user is available
    useEffect(() => {
      if (user) {
        fetchOrders();
        console.log('[User Detected] User ID:', user.id);
      }
    }, [user, fetchOrders]);

    // debug logging
    useEffect(() => {
      console.log('Interactivity Check', {
        canInteract: !updating && !loading,
        updating,
        loading,
        dialogOpen: isDialogOpen,
        selectedOrder: !!selectedOrder,
        selectedStatus
      });
    }, [updating, loading, isDialogOpen, selectedOrder, selectedStatus]);
    

    // Loading skeleton
    if (loading) {
      return (
        <div className="flex flex-col h-screen w-screen p-4 space-y-4 bg-white">
          <Skeleton className="h-[25%] w-full rounded-xl" />
          
          <div className="flex flex-col justify-between flex-grow space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
    }


    else {
    
    return (
      <div>
        <Tabs value={status} onValueChange={setStatus} defaultValue="all" className="w-full">
          {/* Tabs row */}
          <TabsList className="flex gap-2 justify-start max-w-[60%]">
            <TabsTrigger value="all" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
              <PackageCheck className="w-4 h-4" />
              All orders
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {allOrdersCount}
              </span>
            </TabsTrigger>

            <TabsTrigger value="Pending" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
              <Clock className="w-4 h-4" />
              Pending
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            </TabsTrigger>

            <TabsTrigger value="Shipped" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
              <Truck className="w-4 h-4" />
              Shipped
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {shippedCount}
              </span>
            </TabsTrigger>

            <TabsTrigger value="Processing" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
              <PackageSearch className="w-4 h-4" />
              Processing
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {processingCount}
              </span>
            </TabsTrigger>

            <TabsTrigger value="Completed" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
              <PackageSearch className="w-4 h-4" />
              Completed
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {completedCount}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Tab content */}
          <TabsContent value={status}>
            <div className="w-full min-h-screen px-4 py-1">
              <DataTable columns={columns} data={displayed} />
            </div>
          </TabsContent>
        </Tabs>

       
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={setDialogOpen }
  
        >
          <DialogContent>
            <DialogTitle>Update Order</DialogTitle>
            <div className="space-y-4">
              {selectedOrder && (
                <div className="grid gap-2">
                  <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                  <p><strong>Current Status:</strong> {selectedOrder.status}</p>
                </div>
              )}
              
              <div className="grid gap-2">
                <label htmlFor="status-select">Select New Status:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      id="status-select"
                      variant="outline" 
                      className="w-full justify-between"
                      disabled={updating}
                    >
                      {selectedStatus || "Select status..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search status..." />
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {orderStatuses.map((orderStatus) => (
                          <CommandItem
                            key={orderStatus.value}
                            value={orderStatus.value}
                            onSelect={() => handleStatusSelect(orderStatus.value)}
                          >
                            {orderStatus.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    setSelectedOrder(null);
                    setSelectedStatus(null);
                  }}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={updating || !selectedStatus || selectedStatus === selectedOrder?.status}
                >
                  {updating ? "Updating..." : "Update Order"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default SellerOrders;