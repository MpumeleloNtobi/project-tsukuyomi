"use client";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// these are from shadcn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const storeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters" }),
});

export default function CreateStorePage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
    },
  });
  const clerk_id = useAuth()?.userId;

  async function handleSubmit(values: { name: string }) {
    try {
      // Get the clerkId using useAuth()
      const values_two = {
        name: values.name,
        clerkId: clerk_id,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values_two),
        },
      );

      if (!res.ok) {
        toast.error("Failed to create store");
        return;
      }

      toast.success("Store created!");
      router.push("/seller/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  placeholder="Enter store name"
                  className="border px-3 py-2 rounded"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
        >
          Create
        </button>
      </form>
    </Form>
  );
}
