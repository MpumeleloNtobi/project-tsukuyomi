"use client";

import { useState, useEffect } from "react";
import { type Store } from "@/app/data/store"; // Make sure the path is correct
import StoreGallery from "@/components/StoreGallery"; // Ensure this component exists
import Header from "@/components/Header";

function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stores`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch stores: ${response.status} ${response.statusText}`
          );
        }
        const data: Store[] = await response.json();
        setStores(data);
      } catch (err: any) {
        setError(err.message);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return <p>Loading stores...</p>;
  }

  if (error) {
    return <p>Error loading stores: {error}</p>;
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          <div>
            <StoreGallery
              stores={stores}
              title="🛍️ Explore Unique Local Stores from Talented Creators! 🌟"
            />
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
