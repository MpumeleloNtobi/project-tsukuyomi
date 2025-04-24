import { Button } from '@/components/ui/button'
import React from 'react'

const SellerDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800">Seller Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome to your dashboard!</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href="/store">View My Store</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/seller/products/add">Add Products</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
