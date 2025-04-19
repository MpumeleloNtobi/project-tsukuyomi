//import Link from 'next/link'
//import { Button } from '@/components/ui/button'
"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/app/data/product";
import ProductGallery  from "@/components/ProductGallery"

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status} ${response.statusText}`,
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
    };

    fetchProducts();
  }, []);

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
      <ProductGallery products={products} title="🎉 Celebrate Craftsmanship! Discover and support the incredible talent of our artisans. 🥳" />
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
  )
}
export default Home;