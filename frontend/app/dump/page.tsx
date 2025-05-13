'use client';

import { useState } from 'react';
import { products } from '@/app/data/product';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Props = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: Props) {
  const productId = parseInt(params.id);
  const product = products.find((p) => p.id === productId);

  const [cartCount, setCartCount] = useState(0);

  if (!product) return notFound();

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="p-6">
      {/* Header with Cart */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold">&lt;Header/&gt;</div>
        <div className="relative flex items-center gap-2">
          <span>{cartCount}</span>
          <Image src="/cart-icon.svg" alt="Cart" width={24} height={24} />
        </div>
      </div>

      {/* Product Card */}
      <div className="border p-4 rounded shadow max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="w-full aspect-square bg-gray-200" />
          <div className="w-full aspect-square bg-gray-200" />
          <div className="w-full aspect-square bg-gray-200" />
        </div>

        <h1 className="text-xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg text-gray-800 mb-1">R {product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600 mb-4">Description of product</p>

        <button
          onClick={handleAddToCart}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
