//import Link from 'next/link'
//import { Button } from '@/components/ui/button'
"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/app/data/product";
import SellerProductGallery from "@/components/SellerProductGallery";
import { useUser } from "@clerk/nextjs";

function Home() {
  const { user } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined; // Explicitly type storeId
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      if (storeId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${storeId}`
          ); // Use the storeId in the fetch URL
          if (!response.ok) {
            throw new Error(
              `Failed to fetch products: ${response.status} ${response.statusText}`
            );
          }
          const data: Product[] = await response.json();
          setProducts(data);
        } catch (err: any) {
          setError(err.message);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Handle the case where storeId is not yet available or undefined
        setLoading(false);
        setError(
          "Store ID not found. Please ensure you are logged in and have a store associated with your account."
        );
        setProducts([]);
      }
    };

    fetchProducts();
  }, [storeId]); // Re-run the effect when storeId changes

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error loading products: {error}</p>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          <div>
            <SellerProductGallery products={products} title="My Store" />
          </div>
        </main>
        <footer className="flex w-full items-center justify-center bg-gray-100 py-6 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              (c) 2024 Q&A platform. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
