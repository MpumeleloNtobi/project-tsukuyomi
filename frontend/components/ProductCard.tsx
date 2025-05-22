"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/app/hooks/use-cart";
import { Product } from "@/types/products";
import { Badge } from "./ui/badge";
import Link from "next/link";

interface ProductCardProps extends Product {
  onClick?: (product: Product) => void;
}

export default function ProductCard({
  id = 168,
  storeId = "06e14636-f586-4b1f-bf60-96d6742d95ee",
  name = "Smartphone Z",
  description = "Latest generation smartphone with AI camera.",
  price = 799.99,
  stockQuantity = 50,
  category = "Electronics",
  image1url = "https://placehold.co/600x400?text=Smartphone+Z",
  onClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: String(id),
      name,
      description,
      price,
      quantity: 1,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick({
        id,
        storeId,
        name,
        description,
        price,
        stockQuantity,
        category,
        image1url,
      });
    }
  };

  const ImageSection = (
    <div className="relative w-full h-[200px]">
      <Image
        src={image1url || "/placeholder.svg"}
        alt={name}
        fill
        className={`object-cover transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
      />
    </div>
  );

  return (
    <Card
      className="w-full max-w-[300px] overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {onClick ? (
        <div onClick={handleClick} className="cursor-pointer">
          {ImageSection}
        </div>
      ) : (
        <Link href={`/stores/${storeId}/products/${id}`}>{ImageSection}</Link>
      )}

      <CardContent className="p-4 pt-3 pb-0">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-gray-300 text-black">{stockQuantity}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">R{price}</span>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
