'use client';

import { useState, ReactElement } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Store } from 'lucide-react';
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

const storeSchema = z.object({
  storeName: z.string().min(2),
  storeDescription: z.string().min(10),
  stitchClientKey: z.string().optional(),
  stitchClientSecret: z.string().optional(),
  streetAddress: z.string().min(5),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  town: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type StoreForm = z.infer<typeof storeSchema>;

export function CreateStoreModal(): ReactElement {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { userId: clerk_id } = useAuth();
  const form = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: '',
      storeDescription: '',
      stitchClientKey: '',
      stitchClientSecret: '',
      streetAddress: '',
      streetNumber: '',
      streetName: '',
      town: '',
      province: '',
      postalCode: '',
      country: '',
    },
  });

  const onSubmit = async (values: StoreForm) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, clerkId: clerk_id }),
      });

      if (!res.ok) throw new Error('Create failed');
      toast.success('Store created!');
      setOpen(false);
      router.push('/');
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="outline"><Store/>Create a store</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
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
              name="storeName"
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
              name="storeDescription"
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
              name="stitchClientKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stitch Client Key</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="test-bfd0ab2c-0258-4973-8f4c-06e0e0ad97a3"
                      className="w-full border px-3 py-2 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="stitchClientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stitch Client Secret</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="PQZn85k9I2P2DqbhifL0h3C0VhLLJhaXWimS6JAmqGWw3AixZ54f0nR1reGL6J/2"
                      className="w-full border px-3 py-2 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      onSelect={(place) => {
                        const addr = place.formatted_address || '';
                        field.onChange(addr);
                        const comps: Record<string, string> = {};
                        (place.address_components || []).forEach((c) =>
                          c.types.forEach((t) => {
                            if (t === 'street_number') comps.streetNumber = c.long_name;
                            else if (t === 'route') comps.streetName = c.long_name;
                            else if (t === 'locality') comps.town = c.long_name;
                            else if (t === 'administrative_area_level_1')
                              comps.province = c.short_name;
                            else if (t === 'postal_code') comps.postalCode = c.long_name;
                            else if (t === 'country') comps.country = c.long_name;
                          })
                        );
                        form.setValue('streetNumber', comps.streetNumber || '');
                        form.setValue('streetName', comps.streetName || '');
                        form.setValue('town', comps.town || '');
                        form.setValue('province', comps.province || '');
                        form.setValue('postalCode', comps.postalCode || '');
                        form.setValue('country', comps.country || '');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className="w-full cursor-pointer"
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
