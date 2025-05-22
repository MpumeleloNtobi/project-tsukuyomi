import { CartProvider } from "@/app/hooks/use-cart";
import Header from "@/components/Header";
import type { ReactNode } from "react";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ storeId: string }>;
  children: ReactNode;
}) {
  const { storeId } = await params; // Resolve the promise here
  return (
    <CartProvider storeId={storeId}>
      <Header showCart={true} />
      <main className="container mx-auto py-8">{children}</main>
    </CartProvider>
  );
}
