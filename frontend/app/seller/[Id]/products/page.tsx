
//Displays a datatable of all the products along with their details,products should be clickable
'use client'
import {useUser} from "@clerk/nextjs"
import { Product } from "@/components/product-column"
import { DataTable } from "@/components/data-table"
import { useState, useEffect } from "react";
import React from "react";
import {useRouter} from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/forms/addproductform";
import { getColumns } from "@/components/product-column";
import ProductTableSkeleton from "@/components/productTableskeleton";
import { Plus } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";







function SellersProducts() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const storeid = user?.publicMetadata?.storeId;
    
  
    const fetchProducts = async () => {
      if (!storeid) return;
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${storeid}`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        setProducts(data);
        console.log(products)
      } catch (error: any) {
        setError(error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSuccess = () => {
      setOpen(false);       
      fetchProducts();      
    };
  
    useEffect(() => {
      if (storeid) fetchProducts();
    }, [user]);
  
    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error loading products: {error}</p>;
  
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

  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogDescription>
        Fill in the details to create a new product.
      </DialogDescription>
    </DialogHeader>

    <ProductForm onSuccess={handleSuccess} />
  </DialogContent>
</Dialog>
        </div>
        {loading ? <ProductTableSkeleton /> :<DataTable columns={getColumns({ onDeleteSuccess: fetchProducts })} data={products} />}
      </div>
    );
  }
  
  export default SellersProducts;



