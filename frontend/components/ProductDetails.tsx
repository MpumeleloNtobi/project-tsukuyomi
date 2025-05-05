"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/app/hooks/use-cart"

export type Product = {
  id: number
  storeId: string
  name: string
  description: string
  price: number
  stockQuantity: number
  category: string
  image1url?: string | null
  image2url?: string | null
  image3url?: string | null
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart = () => {} }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0)

  // Create an array of available images
  const images = [
    product.image1url || "/placeholder.svg?height=600&width=600",
    product.image2url || "/placeholder.svg?height=600&width=600",
    product.image3url || "/placeholder.svg?height=600&width=600",
  ]

  const isInStock = product.stockQuantity > 0
const { addItem } = useCart()

  const handleAddToCart = (id: string, name: string, description: string, price: number, quantity: number) => {
    addItem({
      id: id,
      name: name,
      description: description,
      price: price,
      quantity: 1,
    })
  }
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="p-6">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
            <Image
              src={images[activeImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover object-center transition-transform duration-500"
            />
          </div>

          {/* All Images Row */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative overflow-hidden rounded-md aspect-square border-2 transition-all ${
                  activeImage === index ? "border-rose-500 scale-105" : "border-transparent"
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
        <div className="flex flex-col justify-between p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-full px-3 py-1 text-xs font-medium">
                  {product.category}
                </Badge>
                <span className="text-2xl font-bold text-rose-600">R{product.price.toFixed(2)}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-3">{product.name}</h1>
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
                  <span className="text-sm text-gray-500">{product.stockQuantity} available</span>
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

            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => handleAddToCart(`${product.id}`,product.name,product.description,product.price,1)}
              disabled={!isInStock}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-6 flex items-center justify-center gap-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
