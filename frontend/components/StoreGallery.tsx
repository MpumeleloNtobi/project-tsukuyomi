"use client"; // Add this directive for client-side rendering in Next.js

import { useState, useEffect } from "react";
import StoreCard from "@/components/StoreCard";
import { Store } from "@/types/stores";

export default function StoreGallery() {
    const [stores, setStores] = useState<Store[] | undefined>(undefined); // Initialize with undefined
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
        
    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores`); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch stores: ${response.status} ${response.statusText}`,
                    );
                }
                const stores: Store[] = await response.json();
                setStores(stores);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchStores(); // Call the function inside the effect
    }, []); // Empty dependency array ensures this runs once when the component mounts

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!stores || stores.length === 0) {
        return <div>No stores found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stores.map((store) => (
                <StoreCard
                    key={store.id}
                    id={store.id}
                    name={store.name}
                    description={store?.description|| ' '}
                />
            ))}
        </div>
    );
}
