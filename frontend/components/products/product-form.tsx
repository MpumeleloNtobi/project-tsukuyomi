"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import axios from "axios";
import { toast } from "sonner";
import { MultiImageUploader } from "@/components/multi-image-uploader";

interface Product {
  id: number;
  storeId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  image1url: string | null;
  image2url: string | null;
  image3url: string | null;
}

interface ProductFormProps {
  product?: Product;
  storeId?: string;
  onSuccess: () => void;
}

export function ProductForm({
  product: initialProduct,
  storeId,
  onSuccess,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(initialProduct);
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImageURLs, setUploadedImageURLs] = useState<(string | null)[]>(
    [
      product?.image1url || null,
      product?.image2url || null,
      product?.image3url || null,
    ],
  );

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedImageURLs([urls[0] || null, urls[1] || null, urls[2] || null]);
  };

  // Fetch product if not passed as prop
  useEffect(() => {
    const fetchProduct = async () => {
      if (!initialProduct) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${initialProduct.id}`,
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const formValues = Object.fromEntries(formData.entries());

      // Upload images if any
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        const uploadForm = new FormData();
        images.forEach((file) => uploadForm.append("files", file));
        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-multiple`,
          uploadForm,
        );
        uploadedImageUrls = uploadRes.data.urls; // adjust based on your API's response
      }

      // Compose payload with changed fields only
      const payload = {
        ...formValues,
        id: product?.id || undefined,
        storeId: storeId || product?.storeId,
        price: parseFloat(formValues.price as string),
        stockQuantity: parseInt(formValues.stockQuantity as string),
        image1url: uploadedImageURLs[0],
        image2url: uploadedImageURLs[1],
        image3url: uploadedImageURLs[2],
      };

      // Conditionally add image URLs if newly uploaded
      if (uploadedImageUrls.length > 0) {
        payload.image1url = uploadedImageUrls[0] || null;
        payload.image2url = uploadedImageUrls[1] || null;
        payload.image3url = uploadedImageUrls[2] || null;
      }
      console.log(payload);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${product?.id}`,
        payload,
      );

      onSuccess();
      toast.success("Product updated!");
    } catch (err) {
      console.log("Error updating product", err);
      toast.error("Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" defaultValue={product.name} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          defaultValue={product.category}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product.description}
          placeholder="Product description..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (R)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.price}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            defaultValue={product.stockQuantity}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Product Images</Label>
        <MultiImageUploader onImagesUploaded={handleImagesUploaded} />
      </div>

      <Button type="submit" className="mt-4" disabled={isLoading}>
        {isLoading ? "Saving..." : "Update Product"}
      </Button>
    </form>
  );
}
