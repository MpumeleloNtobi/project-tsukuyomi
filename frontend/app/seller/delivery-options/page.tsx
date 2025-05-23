'use client'

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Switch } from "@/components/ui/switch"
import { toast} from "sonner"

type StoreData = {
  id: string
  clerkId: string
  name: string
  status: string
  description: string | null
  stitchClientKey: string
  city: string | null
  town: string | null
  postalCode: string | null
  streetName: string | null
  streetNumber: string | null
  stitchClientSecret: string
  pickup_enabled?: boolean
}

export default function ShippingPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const storeId = user?.publicMetadata?.storeId as string | undefined

  const [store, setStore] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pickupEnabled, setPickupEnabled] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (isUserLoaded && storeId) {
      const fetchStoreData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${storeId}`)
          if (!res.ok) throw new Error("Failed to fetch store data")
          const data = await res.json()
          setStore(data)
          setPickupEnabled(data.pickup_enabled ?? false)
        } catch (err) {
          console.error("Error fetching store data:", err)
          setError("Failed to load store information.")
          toast.error("Failed to load store information.")
        } finally {
          setLoading(false)
        }
      }

      fetchStoreData()
    } else if (isUserLoaded && !storeId) {
      setLoading(false)
      setError("No store associated with this account.")
      toast.error("No store associated with this account.")
    }
  }, [isUserLoaded, storeId])

  const handleTogglePickup = async (newValue: boolean) => {
    if (!storeId) return
    setUpdating(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${storeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickup_enabled: newValue }),
      })

      if (!res.ok) throw new Error("Failed to update pickup setting.")
      const updated = await res.json()
      setStore(updated)
      setPickupEnabled(updated.pickup_enabled ?? false)
      toast.success(`Pickup option ${newValue ? "enabled" : "disabled"}`)
    } catch (err) {
      console.error("Error updating pickup setting:", err)
      toast.error("Failed to update pickup setting.")
    } finally {
      setUpdating(false)
    }
  }

  const address = store
    ? `${store.streetNumber ?? ""} ${store.streetName ?? ""}, ${store.town ?? ""}, ${store.city ?? ""}, ${store.postalCode ?? ""}`.trim()
    : ""

  return (
    <div className="container p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Options</h1>
          <p className="text-muted-foreground">Configure your delivery and pickup options for customers.</p>
        </div>

        <div className="space-y-4 p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">We have your store address saved as:</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {loading ? "Loading..." : error ?? address || "No address available"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Allow customers to pick up their order at this address.
            </p>
            <Switch
              checked={pickupEnabled}
              disabled={updating}
              onCheckedChange={handleTogglePickup}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
