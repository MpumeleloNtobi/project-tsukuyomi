"use client"

import { useState } from "react"
import { ShoppingCartIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/app/hooks/use-cart"
import { CheckoutModal } from "@/components/CheckoutModal"
import { Trash } from 'lucide-react';

export function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { storeId, items, removeItem, totalItems } = useCart()

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const openCheckout = () => {
    setIsCheckoutOpen(true)
  }

  const closeCheckout = () => {
    setIsCheckoutOpen(false)
  }

  return (
    <>
      <div className="relative">
        {/* Cart Button with Item Count */}
        <Button variant="outline" className="rounded-full px-4 border-2" onClick={toggleCart}>
          <span className="mr-2">{totalItems}</span>
          <ShoppingCartIcon className="h-5 w-5" />
        </Button>

        {/* Cart Dropdown */}
        {isOpen && (
          <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-lg">
            <div className="max-h-96 overflow-auto">
              {items.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">Your cart is empty</div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex gap-4">
                   
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="mt-1">R{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex-row">
                      <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                      <Trash/>
                      </Button>
                      <p className="p-1 ml-3">{item.quantity}</p>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))
              )}
            </div>
            <div className="p-4">
              <Button className="w-full" onClick={openCheckout} disabled={items.length === 0}>
                Checkout
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </>
  )
}
