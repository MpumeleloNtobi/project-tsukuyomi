"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/app/hooks/use-cart";

export type Product = {
  id: number;
  storeId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  image1url?: string | null;
  image2url?: string | null;
  image3url?: string | null;
};

interface ProductDetailsProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClose?: () => void;
}

export default function ProductDetails({
  product,
  onAddToCart = () => {},
  onClose,
}: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const isInStock = product.stockQuantity > 0;

  const images = [
    product.image1url || "/placeholder.svg?height=600&width=600",
    product.image2url || "/placeholder.svg?height=600&width=600",
    product.image3url || "/placeholder.svg?height=600&width=600",
  ];

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}`,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: 1,
    });
    onAddToCart(product);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 mx-auto align-middle">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
            <Image
              src={images[activeImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative overflow-hidden rounded-md aspect-square border-2 transition-all ${
                  activeImage === index
                    ? "border-rose-500 scale-105"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <Badge>{product.category}</Badge>
                <span className="text-2xl font-bold text-gray-900">
                  R{product.price.toFixed(2)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-3">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {product.stockQuantity} available
                  </span>
                </>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Out of Stock</span>
                </Badge>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="w-full"
              variant={"default"}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
