"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/products";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SendToBack } from "lucide-react";
import Link from "next/link";

const sampleProduct: Product = {
  id: 168,
  storeId: '06e14636-f586-4b1f-bf60-96d6742d95ee',
  name: 'Smartphone Z',
  description: 'Latest generation smartphone with AI camera.',
  price: 799.99,
  stockQuantity: 50,
  category: 'Electronics',
  image1url: 'https://placehold.co/600x400?text=Smartphone+Z',
  image2url: null,
  image3url: null
};

function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const params = useParams<{ productId: string, storeId: string }>();


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${params.productId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
        setProduct(sampleProduct); // Fallback to sample product
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.storeId, params.productId]);

  if (loading) {
    return <p className="text-center text-xl text-gray-500">Loading product...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500">Error loading product: {error}</p>;
  }

  if (!product) {
    return <p className="text-center text-xl text-red-500">Product not found</p>;
  }

  
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
      <Link href={`/stores/${params.storeId}`}>
        <Button variant="outline" className="flex items-center gap-2 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Button>
      </Link>      
      <ProductCard product={product} />
      </div>
    </main>
  )
}


export default ProductPage;
