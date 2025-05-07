"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/app/hooks/use-cart"
import { Product } from "@/types/products"
import { Badge } from "./ui/badge"
import Link from "next/link"

export default function ProductCard({
  id= 168,
  storeId= "06e14636-f586-4b1f-bf60-96d6742d95ee",
  name= "Smartphone Z",
  description= "Latest generation smartphone with AI camera.",
  price= 799.99,
  stockQuantity= 50,
  category= "Electronics",
  image1url= "https://placehold.co/600x400?text=Smartphone+Z"
}: Product) {
  const [isHovered, setIsHovered] = useState(false)
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
    <Card
      className="w-full max-w-[300px] overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/stores/${storeId}/products/${id}`}>
      <div className="relative bg-gray-100 p-4">
        <div className="relative h-[200px] w-full">
          <Image
            src={image1url || "/placeholder.svg"}
            alt={description}
            fill
            className={`object-contain transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
          />
        </div>
      </div>
      </Link>
      <CardContent className="p-4 pt-3 pb-0">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{name}</h3>
        <div className="flex items-center gap-2 mb-2">
         <Badge className="bg-gray-300 text-black">{stockQuantity}</Badge>
        </div>
        <span className="text-xl font-bold">R{price}</span>
        <Button variant={"outline"}className="float-right hover:bg-linear-to-r from-rose-500 via-pink-500 to-red-500 cursor-pointer"  onClick={() => handleAddToCart(`${id}`,name,description,price,1)}>Add to cart</Button>
      </CardContent>
      
    </Card>
  )
}