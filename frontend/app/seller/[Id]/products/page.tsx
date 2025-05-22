"use client";

import { useUser } from "@clerk/nextjs";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/forms/addproductform";
import { getColumns } from "@/components/product-column";
import ProductTableSkeleton from "@/components/productTableskeleton";
import { Plus } from "lucide-react";

export default function SellersProducts() {
  const { user } = useUser();
  const storeId = user?.publicMetadata?.storeId as string;
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${storeId}`,
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setProducts(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const handleSuccess = () => {
    setOpen(false);
    fetchProducts();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-center">Add New Product</DialogTitle>
            </DialogHeader>

            <ProductForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <ProductTableSkeleton />
      ) : (
        <DataTable
          columns={getColumns({ onDeleteSuccess: fetchProducts })}
          data={products}
        />
      )}
    </div>
  );
}
