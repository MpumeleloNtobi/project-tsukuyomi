// StoreGallery.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type Store } from "@/app/data/store";
import StoreCard from "@/components/StoreCard"; // ✅ import your reusable card

interface StoreGalleryProps {
  title?: string;
  stores: Store[];
}

function StoreGallery({
  title = "Store Gallery",
  stores: initialStores,
}: StoreGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState<Store[]>(initialStores);

  useEffect(() => {
    const filteredStores = initialStores.filter((store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setStores(filteredStores);
  }, [searchTerm, initialStores]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search stores..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              name={store.name}
              imageUrl={store.imageUrl}
              description={store.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreGallery;
