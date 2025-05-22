"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { MultiImageUploader } from "@/components/multi-image-uploader";

interface ProductFormProps {
  storeId: string;
  onSuccess: () => void;
}

export function ProductForm({ storeId, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImageURLs, setUploadedImageURLs] = useState<(string | null)[]>(
    [null, null, null],
  );

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedImageURLs([urls[0] || null, urls[1] || null, urls[2] || null]);
  };

  const handleFilesSelected = (files: File[]) => {
    setImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const formValues = Object.fromEntries(formData.entries());

      let uploadedUrls = [...uploadedImageURLs];

      // Upload images if selected
      if (images.length > 0) {
        const uploadForm = new FormData();
        images.forEach((file) => uploadForm.append("files", file));
        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-multiple`,
          uploadForm,
        );
        uploadedUrls = uploadRes.data.urls;
      }

      const payload = {
        ...formValues,
        storeId,
        price: parseFloat(formValues.price as string),
        stockQuantity: parseInt(formValues.stockQuantity as string),
        image1url: uploadedUrls[0] || null,
        image2url: uploadedUrls[1] || null,
        image3url: uploadedUrls[2] || null,
      };

      console.log(payload);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
        payload,
      );

      onSuccess();
      toast.success("Product created!");
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Error creating product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
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
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Product Images</Label>
        <MultiImageUploader
          onImagesUploaded={handleImagesUploaded}
          onFilesSelected={handleFilesSelected}
        />
      </div>

      <Button type="submit" className="mt-4" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}
