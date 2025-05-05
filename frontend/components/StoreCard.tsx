"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface StoreCardProps {
  name: string;
  imageUrl?: string;
  alt?: string;
  description: string;
}

export default function StoreCard({
  name,
  imageUrl = "/placeholder.svg?height=300&width=300",
  alt = "Store image",
}: StoreCardProps) {
  return (
    <Card className="w-full max-w-[300px] overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div className="relative bg-gray-100 p-4">
        <div className="relative h-[200px] w-full">
          <Image src={imageUrl} alt={alt} fill className="object-contain" />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          {name}
        </h3>
      </CardContent>
    </Card>
  );
}
