"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/app/hooks/use-cart";
import { PhoneInput } from "@/components/PhoneInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { CreditCard } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { BADQUERY } from "dns";
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const orderSchema = z.object({
  buyerName: z.string().min(2),
  phoneNumber: z.string().min(10),
  deliveryMethod: z.enum(["pickup", "deliver"]),
  streetAddress: z.string().optional(),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  town: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;
function getExpiryTimestamp(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now.toISOString();
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { storeId, items, clearCart, totalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(items)

  const { user } = useUser();
  const buyerId = user?.id;

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      buyerName: "",
      phoneNumber: "",
      deliveryMethod: "pickup",
    },
  });
  const deliveryMethod = form.watch("deliveryMethod");

  useEffect(() => {
    if (deliveryMethod === "pickup") {
      form.setValue("streetAddress", "");
      form.setValue("streetNumber", "");
      form.setValue("streetName", "");
      form.setValue("town", "");
      form.setValue("province", "");
      form.setValue("postalCode", "");
      form.setValue("country", "");
    }
  });

  const handleCheckout = async (values: OrderForm) => {
    try {
      setIsSubmitting(true);
      console.log(buyerId);
      console.log(items);

      const total = items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
      // 1. Create the order
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: storeId,
            buyerName: values.buyerName,
            buyer_id: buyerId,
            phoneNumber: values.phoneNumber,
            deliveryMethod: values.deliveryMethod,
            city: values.town,
            town: values.town,
            order_items: items,
            total_price: total,
            streetName: values.streetName,
            streetNumber: values.streetNumber,
            postalCode: values.postalCode,
          }),
        },
      );

      if (!orderRes.ok) throw new Error("Failed to create order");

      const order = await orderRes.json();
      console.log('order created')

      // 2. Create payment request
      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stitch/payment-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: storeId,
            amount: Number(totalPrice) * 100,
            orderId: order.order_id,
            payerName: values.buyerName,
            deliveryFee: 0,
          }),
        },
      );
      console.log(paymentRes);

      if (!paymentRes.ok) throw new Error("Failed to create payment");
      const data = await paymentRes.json();
      
      const paymentUrl = `${data.redirectUrl}?redirect_url=${process.env.NEXT_PUBLIC_PAYMENT_REDIRECT_URL}`;

      clearCart();
      onClose();

      // 5. Redirect to payment gateway
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[500px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCheckout)}
              className="space-y-6"
            >
              <div className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput defaultCountry="ZA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Method</FormLabel>
                      <RadioGroup
                        className="flex gap-4"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deliver" id="deliver" />
                          <Label htmlFor="deliver">Deliver to me</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup">Pickup from warehouse</Label>
                        </div>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {deliveryMethod === "deliver" && (
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={field.value || ""}
                            onChange={field.onChange}
                            onSelect={(place) => {
                              const addr = place.formatted_address || "";
                              field.onChange(addr);
                              const comps: Record<string, string> = {};
                              (place.address_components || []).forEach((c) =>
                                c.types.forEach((t) => {
                                  if (t === "street_number")
                                    comps.streetNumber = c.long_name;
                                  else if (t === "route")
                                    comps.streetName = c.long_name;
                                  else if (t === "locality")
                                    comps.town = c.long_name;
                                  else if (t === "administrative_area_level_1")
                                    comps.province = c.short_name;
                                  else if (t === "postal_code")
                                    comps.postalCode = c.long_name;
                                  else if (t === "country")
                                    comps.country = c.long_name;
                                }),
                              );
                              form.setValue(
                                "streetNumber",
                                comps.streetNumber || "",
                              );
                              form.setValue(
                                "streetName",
                                comps.streetName || "",
                              );
                              form.setValue("town", comps.town || "");
                              form.setValue("province", comps.province || "");
                              form.setValue(
                                "postalCode",
                                comps.postalCode || "",
                              );
                              form.setValue("country", comps.country || "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Order Summary */}
                <div className="border rounded-md p-4 mt-6">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 font-medium flex justify-between">
                    <span>Total</span>
                    <span>R{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <CreditCard />
                  {isSubmitting ? "Processing..." : "Continue to Pay"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
