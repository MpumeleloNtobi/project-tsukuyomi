import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// ✅ Keep function async to allow server-side fetch
export default async function OrderPage({ searchParams }: any) {
  const paymentId = searchParams.payment_id;
  const reference = searchParams.reference;

  let status: 'success' | 'error' | 'missing' = 'success';

  if (!paymentId || !reference) {
    status = 'missing';
  } else {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${reference}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentStatus: 'paid',
            paymentId,
          }),
          cache: 'no-store',
        }
      );

      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      console.error('Order update failed:', err);
      status = 'error';
    }
  }

  return (
    <>
      <Header showCart={false} />
      <main className="p-6 text-center space-y-4">
        {status === 'missing' ? (
          <p className="text-red-500">Missing required query parameters.</p>
        ) : status === 'error' ? (
          <>
            <h1 className="text-2xl font-bold text-red-500">❌ Update Failed</h1>
            <p>We couldnt update your order. Please try again or contact support.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful</h1>
            <p className="text-lg">Order confirmed!</p>
            <p><strong>Reference:</strong> {reference}</p>
            <p><strong>Payment ID:</strong> {paymentId}</p>
            <Link href="/home">
              <Button className="mt-4">
                <ShoppingBag className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </>
        )}
      </main>
    </>
  );
}
