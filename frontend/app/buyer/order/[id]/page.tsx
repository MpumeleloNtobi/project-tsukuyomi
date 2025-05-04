'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderPage() {
  const params = useParams();
  const orderId = params?.id;

  const [status, setStatus] = useState<null | 'success' | 'failure'>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`http://localhost:5000/orders/${orderId}`);
        if (!res.ok) {
          throw new Error('Order not found');
        }
        const data = await res.json();

        if (data.payment_status === 'paid') {
          setStatus('success');
        } else {
          setStatus('failure');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Summary</h1>
        <p className="text-sm text-gray-600 mb-4">Order ID: {orderId}</p>

        {loading && (
          <p className="text-gray-600 text-lg font-semibold">
            ⏳ Checking payment status...
          </p>
        )}

        {error && (
          <p className="text-red-600 text-lg font-semibold">
            ❌ {error}
          </p>
        )}

        {!loading && !error && status === 'success' && (
          <p className="text-green-600 text-lg font-semibold">
            ✅ Payment Successful!
          </p>
        )}

        {!loading && !error && status === 'failure' && (
          <p className="text-red-600 text-lg font-semibold">
            ❌ Payment Failed. Please try again.
          </p>
        )}

        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}