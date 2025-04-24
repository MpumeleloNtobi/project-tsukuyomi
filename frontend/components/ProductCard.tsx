"use client"

import { useState } from "react"
import Image from "next/image"
//import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
//import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  name: string
  price: number
  image: string
  alt: string
}

export default function ProductCard({
  name = "Nike Air MX Super 2500 - Red",
  price = 449,
  image = "/placeholder.svg?height=300&width=300",
  alt = "Product image",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="w-full max-w-[300px] overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gray-100 p-4">
      
        <div className="relative h-[200px] w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={alt}
            fill
            className={`object-contain transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
          />
        </div>
      </div>
      <CardContent className="p-4 pt-3 pb-0">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">R{price}</span>
        </div>
        
      </CardContent>
      <CardFooter className="p-4 pt-3">
        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Add to cart</Button>
      </CardFooter>
    </Card>
  )
}

/**
<div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
          <span className="ml-1 text-sm text-gray-700">{rating.toFixed(1)}</span>
        </div>
*/ 