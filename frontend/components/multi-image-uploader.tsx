"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Upload, Check, Loader2 } from "lucide-react";
import Image from "next/image";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: UploadStatus;
  progress: number;
  url?: string;
  error?: string;
}

interface MultiImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
}

export function MultiImageUploader({
  onImagesUploaded,
}: MultiImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: "idle" as UploadStatus,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const uploadAllImages = async () => {
    if (images.length < 3) {
      setErrorMessage("Please select at least 3 images.");
      return [];
    }

    setErrorMessage(""); // Clear any previous errors
    setIsUploading(true);

    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", img.file);
    });

    try {
      setImages((prev) => prev.map((img) => ({ ...img, status: "uploading" })));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-multiple`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!data.files || !Array.isArray(data.files))
        throw new Error("Invalid response from server");

      const uploadedUrls = data.files.map((f) => f.blobUrl);

      const updated = images.map((img, idx) => ({
        ...img,
        status: "success" as UploadStatus,
        progress: 100,
        url: uploadedUrls[idx] || null,
      }));

      setImages(updated);
      onImagesUploaded(uploadedUrls);

      return uploadedUrls;
    } catch (error) {
      console.error("Upload failed:", error);
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          status: "error" as UploadStatus,
          progress: 0,
          error: "Upload failed",
        })),
      );
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: UploadStatus, progress: number) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select Images
        </Button>
        <Button
          type="button"
          onClick={uploadAllImages}
          disabled={
            isUploading ||
            images.length === 0 ||
            images.every((img) => img.status === "success")
          }
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Images"
          )}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((image) => (
            <Card key={image.id} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={image.preview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 flex items-center justify-between">
                  <span className="truncate max-w-[80%]">
                    {image.file.name}
                  </span>
                  {getStatusIcon(image.status, image.progress)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
