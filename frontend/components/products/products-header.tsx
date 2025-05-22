"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/products/create-product-form";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function ProductsHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, isLoaded: isUserLoaded } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined;

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inventory & products
        </h1>
        <p className="text-muted-foreground">
          Manage your product inventory, edit details, and adjust quantities.
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
            <DialogDescription>
              Add a new product to your store.
            </DialogDescription>
          </DialogHeader>
          <ProductForm storeId={storeId} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
