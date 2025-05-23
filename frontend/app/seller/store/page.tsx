"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/app/data/product";
import SellerProductGallery from "@/components/SellerProductGallery";
import { useUser } from "@clerk/nextjs";
import HotPinkLineSpinner from "@/components/pink-spinner";
import Spinner from "@/components/ldr-spinner";

function Home() {
  const { user } = useUser();
  const storeId = user?.publicMetadata?.storeId as string | undefined;
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${storeId}`,
          );
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
      } else {
        setLoading(false);
        setProducts([]);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [storeId]);

  if (loading) {
    return <Spinner />; // Render our custom spinner
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">
          Error loading products: {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <SellerProductGallery products={products} title="My Store" />
      </div>
    </>
  );
}

export default Home;
