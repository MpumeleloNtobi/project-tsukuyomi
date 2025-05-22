"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Page() {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requiredFiles = 3;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (images.length !== requiredFiles) {
        setError(`Please select exactly ${requiredFiles} images`);
        return;
      }

      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`picture${index + 1}`, image);
      });

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Unexpected server response");
      }

      if (!response.ok) {
        setError(data.message || `Upload failed: ${response.statusText}`);
        return;
      }

      setImages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-sm items-center gap-1.5"
      >
        <Label>Product Images (3 required)</Label>
        <MultipleImageUploader
          onFilesChange={setImages}
          requiredCount={requiredFiles}
        />
        <Button
          type="submit"
          className="mt-4"
          disabled={images.length !== requiredFiles || isSubmitting}
        >
          {isSubmitting ? "Uploading..." : "Upload All Images"}
        </Button>
      </form>
    </section>
  );
}
