"use client";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(10),
  price: z.coerce.number().min(1),
  stockQuantity: z.coerce.number().int().min(1),
  category: z.string().min(3),
});

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Plus } from "lucide-react";

type Props = { onSuccess: () => void };

export default function ProductForm({ onSuccess }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const [storeId, setStoreId] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 1,
      stockQuantity: 1,
      category: "",
    },
  });

  useEffect(() => {
    const sid = user?.publicMetadata.storeId as string;
    if (sid) setStoreId(sid);
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (!storeId) throw new Error("Store ID not found");
      if (images.length !== 3) throw new Error("Upload exactly 3 images");

      const data = new FormData();
      data.append("storeId", storeId);
      data.append("name", values.name);
      data.append("description", values.description);
      data.append("price", values.price.toString());
      data.append("stockQuantity", values.stockQuantity.toString());
      data.append("category", values.category);
      images.forEach((img, i) => data.append(`picture${i + 1}`, img));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
        { method: "POST", body: data },
      );
      const text = await res.text();
      if (!res.ok) {
        let err;
        try {
          err = JSON.parse(text).error;
        } catch {
          err = text;
        }
        throw new Error(err || `Status ${res.status}`);
      }

      form.reset();
      setImages([]);
      toast.success("Product added successfully!");
      onSuccess();
      router.push(`/seller/${storeId}/products`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="overflow-y-auto p-1 space-y-6">
      <Form {...form}>
        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Stock quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Product Images (3 required)</FormLabel>
            <MultipleImageUploader
              onFilesChange={setImages}
              requiredCount={3}
            />
          </div>
        </form>
      </Form>

      <div className="bg-white sticky bottom-0">
        <Button
          type="submit"
          form="product-form"
          className="w-full"
          disabled={isSubmitting || images.length !== 3}
          onClick={form.handleSubmit(onSubmit)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </Button>
      </div>
    </div>
  );
}
