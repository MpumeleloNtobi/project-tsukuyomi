"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/app/data/product";
import ProductGallery from "@/components/ProductGallery";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { CartProvider } from "@/app/hooks/use-cart";

interface storeDetails {
  name: string;
  description: string;
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeDetails, setStoreDetails] = useState<storeDetails>();
  const [storeDetailsloading, setStoreDetailsLoading] = useState(true);
  const [storeDetailserror, setStoreDetailsError] = useState<string | null>(
    null,
  );
  const params = useParams<{ storeId: string }>();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setStoreDetailsLoading(true);
      setStoreDetailsError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${params.storeId}`,
        ); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Store: ${response.status} ${response.statusText}`,
          );
        }
        const store: storeDetails = await response.json();
        setStoreDetails(store);
      } catch (err: any) {
        setStoreDetailsError(err.message);
        setStoreDetails({ name: "", description: "" });
      } finally {
        setStoreDetailsLoading(false);
      }
    };
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?storeId=${params.storeId}`,
        ); // Replace with your API endpoint
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
    fetchStoreDetails();
    fetchProducts();
  }, [params.storeId]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error loading products: {error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <ProductGallery
            products={products}
            title={storeDetails?.name}
            description={storeDetails?.description}
          />
        </div>
      </main>
    </div>
  );
}
export default Home;
