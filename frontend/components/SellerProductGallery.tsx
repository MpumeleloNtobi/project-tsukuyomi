"use client";

import { useState, useEffect, useRef } from "react"; // Import useRef
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SellerProductCard from "@/components/SellerProductCard";
import { type Product } from "@/app/data/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SellerProductDetails from "@/components/SellerProductDetails";

interface ProductGalleryProps {
  title?: string;
  products: Product[];
  description?: string;
}

function SellerProductGallery({
  title = "Product Gallery",
  products: initialProducts,
  description = "",
}: ProductGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Create a ref for the dialog element
  const dialogRef = useRef<HTMLDialogElement>(null);

  const categories = [
    "all",
    ...Array.from(new Set(initialProducts.map((product) => product.category))),
  ];

  useEffect(() => {
    let filteredProducts = initialProducts;

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory,
      );
    }

    setProducts(filteredProducts);
  }, [searchTerm, selectedCategory, initialProducts]);

  // Effect to handle opening/closing the native dialog
  useEffect(() => {
    if (selectedProduct) {
      dialogRef.current?.showModal(); // Use showModal() to open the dialog
    } else {
      dialogRef.current?.close(); // Use close() to close the dialog
    }
  }, [selectedProduct]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <h2 className="text-xl font-bold mb-6">{description}</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <SellerProductCard
              key={product.id}
              id={product.id}
              description={product.description}
              name={product.name}
              price={product.price}
              stockQuantity={product.stockQuantity}
              category={product.category}
              storeId={product.storeId}
              image1url={product.image1url}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Native HTML Dialog for Product Details */}
      <dialog
        ref={dialogRef}
        className="p-6 rounded-lg shadow-lg backdrop:bg-black backdrop:opacity-70"
        onClose={() => setSelectedProduct(null)} // Handle closing when user dismisses with Escape key
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Product Details</h2>
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        {selectedProduct && <SellerProductDetails product={selectedProduct} />}
      </dialog>
    </div>
  );
}

export default SellerProductGallery;
