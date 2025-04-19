import { NextResponse } from "next/server"

// Mock data for demonstration
// In a real app, this would come from your database
const stores = [
  {
    id: "uuid-1",
    clerkId: "clerk-id-1",
    name: "Home Harmony",
    status: "awaiting approval",
  },
  {
    id: "uuid-2",
    clerkId: "clerk-id-2",
    name: "Tech Haven",
    status: "approved",
  },
  {
    id: "uuid-3",
    clerkId: "clerk-id-3",
    name: "Fashion Forward",
    status: "watchlist",
  },
  {
    id: "uuid-4",
    clerkId: "clerk-id-4",
    name: "Outdoor Adventures",
    status: "banned",
  },
  {
    id: "uuid-5",
    clerkId: "clerk-id-5",
    name: "Gourmet Delights",
    status: "awaiting approval",
  },
]

export async function GET() {
  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(stores)
}
