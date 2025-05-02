'use client';

import { ReactElement } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';

// Zod schema
const storeSchema = z.object({
  name:        z.string().min(2, { message: 'Store name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  yocoKey:     z.string().optional(),
  address:     z.string().min(5, { message: 'Address must be at least 5 characters' }),
});
type StoreForm = z.infer<typeof storeSchema>;

export function CreateStoreModal(): ReactElement {
  const router = useRouter();
  const { userId: clerk_id } = useAuth();

  const form = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name:        '',
      description: '',
      yocoKey:     '',
      address:     '',
    },
  });

  const onSubmit = async (values: StoreForm) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, clerkId: clerk_id }),
        }
      );
      if (!res.ok) throw new Error('Create failed');
      toast.success('Store created!');
      router.push('/seller/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Become a Seller</Button>
      </DialogTrigger>

      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(event) => {
            event.preventDefault();
        }}
        >
        <DialogHeader>
          <DialogTitle className="text-center">Create a Store</DialogTitle>
          <DialogDescription className="text-center">
            Provide your store details below
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="My Awesome Store"
                      className="w-full border px-3 py-2 rounded"
                    />
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
                    <textarea
                      {...field}
                      placeholder="Describe your store"
                      rows={3}
                      className="w-full border px-3 py-2 rounded resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yocoKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YOCO Key</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="YOCO API Key"
                      className="w-full border px-3 py-2 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                            <FormControl>
                                <AddressAutocomplete
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSelect={(addr) => {
                                        console.log('🚀 Selected via click:', addr);
                                        field.onChange(addr);
                                    }}
                                />
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
