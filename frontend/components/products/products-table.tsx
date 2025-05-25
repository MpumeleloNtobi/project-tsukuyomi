"use client";

import { useState, useEffect } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductForm } from "./product-form";
import { QuantityAdjuster } from "./quantity-adjuster";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface Product {
  id: number;
  storeId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  image1url: string | null;
  image2url: string | null;
  image3url: string | null;
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { user, isLoaded: isUserLoaded } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined;

  useEffect(() => {
    if (isUserLoaded && storeId) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${storeId}`,
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setProducts(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch products",
          );
          toast.error("Failed to load products");
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    } else if (isUserLoaded && !storeId) {
      setLoading(false);
      setError("No store associated with this account");
    }
  }, [isUserLoaded, storeId]);

  const getStatusBadge = (quantity: number) => {
    if (quantity > 5) {
      return <Badge className="bg-green-500">In Stock</Badge>;
    } else if (quantity > 0) {
      return <Badge className="bg-yellow-500">Low Stock</Badge>;
    } else {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setTimeout(() => setEditingProduct(null), 300);
  };

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProducts(products.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockQuantity: newQuantity }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, stockQuantity: newQuantity }
            : product,
        ),
      );
      toast.success("Product Quantity updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update quantity");
    }
  };

  if (!isUserLoaded || (isUserLoaded && !storeId && !error)) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[200px] mt-2" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px] ml-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-[100px] mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-destructive">{error}</div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (products.length === 0 && isUserLoaded && storeId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div>Its a little empty in here...</div>
        <p>Start adding products to your store!</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell className="font-medium">
                  <div>{product.name}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {product.description}
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">
                  R{product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <QuantityAdjuster
                      value={product.stockQuantity}
                      onChange={(newValue) =>
                        handleQuantityChange(product.id, newValue)
                      }
                      min={0}
                    />
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(product.stockQuantity)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEdit();
          } else {
            setIsEditOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Make changes to the product information."
                : "Add a new product to your store."}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={editingProduct || undefined}
            storeId={storeId}
            onSuccess={() => {
              handleCloseEdit();
              fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${storeId}`)
                .then((res) => res.json())
                .then((data) => setProducts(data))
                .catch((err) => {
                  setError(err.message);
                  toast.error("Failed to refresh products");
                });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
