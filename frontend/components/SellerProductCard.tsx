"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/app/data/product";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps extends Product {
  onClick?: (product: Product) => void;
}

export default function SellerProductCard({
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

  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;
  const isOutOfStock = stockQuantity === 0;

  return (
    <Card
      className="group w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative">
        {/* Category badge */}
        <div className="absolute left-3 top-3 z-10">
          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
            <Tag className="mr-1 h-3 w-3" />
            {category}
          </Badge>
        </div>

        {/* Stock badge */}
        {isLowStock && (
          <div className="absolute right-3 top-3 z-10">
            <Badge className="bg-pink-500 text-white">
              Only {stockQuantity} left
            </Badge>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute right-3 top-3 z-10">
            <Badge className="bg-gray-500 text-white">Out of Stock</Badge>
          </div>
        )}

        {/* Image section */}
        <div className="relative h-[220px] w-full overflow-hidden bg-gray-50">
          <Image
            src={image1url || "/placeholder.svg"}
            alt={name}
            fill
            className={`object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          />

          {/* Overlay with actions */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white text-gray-800 hover:bg-rose-50 hover:text-rose-600"
                onClick={handleClick}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            ></motion.div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Product name */}
        <h3 className="mb-1 text-base font-medium text-gray-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
          {name}
        </h3>

        {/* Description preview */}
        <p className="mb-3 text-xs text-gray-600 line-clamp-2">{description}</p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            R{price.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
