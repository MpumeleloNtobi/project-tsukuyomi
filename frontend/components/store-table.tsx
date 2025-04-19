"use client"

import { useState, useEffect } from "react"
import { Loader2, Pencil, Save, XCircle } from "lucide-react" // Import icons
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Import Button
import { Input } from "@/components/ui/input" // Import Input
import { updateStoreStatus, updateStoreName } from "@/app/actions" // Import BOTH actions

// Define the store type
interface Store {
  id: string
  clerkId: string
  name: string
  status: "awaiting approval" | "approved" | "watchlist" | "banned"
}

export default function StoreTable() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null) // For status updates
  const [editingId, setEditingId] = useState<string | null>(null) // For name editing
  const [editedName, setEditedName] = useState<string>("") // Temp storage for edited name
  const [savingNameId, setSavingNameId] = useState<string | null>(null); // Loading state for name save

  // Fetch stores data (keep existing fetch logic)
  const fetchStores = async () => {
    setLoading(true); // Ensure loading is true when fetching
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores`)
      if (!response.ok) {
         throw new Error(`Failed to fetch stores: ${response.statusText}`)
      }
      const data = await response.json()
      setStores(data)
    } catch (error) {
      console.error("Error fetching stores:", error)
      toast.error("Failed to load stores data") // Use toast.error
    } finally {
       setLoading(false) // Always set loading to false
    }
  }

  useEffect(() => {
    fetchStores()
    // Polling logic (keep existing)
    const interval = setInterval(fetchStores, 30000)
    return () => clearInterval(interval)
  }, [])

  // Handle status change (keep existing logic)
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const result = await updateStoreStatus(id, newStatus) // Use result from action
      if (result.success && result.updatedStore) {
          // Update local state with data from server
          setStores(stores.map((store) => (store.id === id ? result.updatedStore : store)));
          toast.success(`Store status changed to ${newStatus}`); // Use toast.success
      } else {
          // If success is false or updatedStore is missing (though shouldn't happen with current action)
          toast.error("Update seemed successful but data wasn't returned correctly.");
          fetchStores(); // Refetch as fallback
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "There was a problem updating the store status"); // Show error from action
    } finally {
      setUpdatingId(null)
    }
  }

   // --- Handlers for Name Editing ---
   const handleEditClick = (store: Store) => {
     setEditingId(store.id);
     setEditedName(store.name);
   };

   const handleCancelEdit = () => {
     setEditingId(null);
     setEditedName("");
     setSavingNameId(null); // Clear saving state if cancelled
   };

   const handleSaveName = async (id: string) => {
       if (!editedName || editedName.trim() === '') {
           toast.error("Store name cannot be empty.");
           return;
       }
       setSavingNameId(id); // Indicate saving started for this row
       try {
           const result = await updateStoreName(id, editedName);
           if (result.success && result.updatedStore) {
               // Update local state with data from server
               setStores(stores.map((store) => (store.id === id ? result.updatedStore : store)));
               toast.success("Store name updated successfully!");
               handleCancelEdit(); // Exit editing mode on success
           } else {
                toast.error("Update seemed successful but data wasn't returned correctly.");
                fetchStores(); // Refetch as fallback
                handleCancelEdit();
           }
       } catch (error: any) {
           console.error("Error saving name:", error);
           toast.error(error.message || "Failed to save store name.");
           // Keep editing mode active on error so user can retry or cancel
       } finally {
           // Only clear savingNameId here if you don't keep editing mode on error
           // setSavingNameId(null);
           // Keeping the loader until cancel/retry might be better UX
       }
   };


  // Status badge styling (keep existing logic)
  const getStatusBadge = (status: string) => {
    // ... same as before ...
    switch (status) {
        case "approved":
          return <Badge className="bg-green-500">Approved</Badge>
        case "awaiting approval":
          return <Badge className="bg-yellow-500">Awaiting Approval</Badge>
        case "watchlist":
          return <Badge className="bg-blue-500">Watchlist</Badge>
        case "banned":
          return <Badge className="bg-red-500">Banned</Badge>
        default:
          return <Badge>{status}</Badge>
      }
  }

  if (loading && stores.length === 0) { // Show loading only initially or if stores are empty
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading stores...</span>
      </div>
    )
  }

  return (
    <div className="rounded-md border w-full">
      {/* Added table-fixed for better layout control */}
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
             {/* Adjusted widths - give Name more space, add Actions column */}
            <TableHead className="w-[25%]">ID</TableHead>
            <TableHead className="w-[25%]">Clerk ID</TableHead>
            <TableHead className="w-[15%]">Shop</TableHead>
            <TableHead className="w-[10%]">Name</TableHead>
            <TableHead className="w-[20%]">Status</TableHead>
            <TableHead className="w-[5%] text-center">Actions</TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 && !loading ? ( // Show no stores only if not loading and empty
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No stores found.
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store, index) => (
              <TableRow key={store.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                {/* ID Cell */}
                <TableCell className="font-mono text-xs">{store.id}</TableCell>
                {/* Clerk ID Cell */}
                <TableCell className="font-mono text-xs">{store.clerkId}</TableCell>
                 {/* Store Url Cell */}
                 <TableCell className="font-mono text-xs">
                  <a
                    href={`/stores/${store.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Store
                  </a>
                 </TableCell>
                {/* Name Cell - Conditional Input/Text */}
                <TableCell>
                  {editingId === store.id ? (
                    <Input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-8" // Adjust height as needed
                      disabled={savingNameId === store.id} // Disable input while saving
                    />
                  ) : (
                    <span className="truncate">{store.name}</span>
                  )}
                </TableCell>
                {/* Status Cell */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(store.status)}
                    <Select
                      value={store.status} // Controlled component might be better here
                      onValueChange={(value) => handleStatusChange(store.id, value)}
                      disabled={updatingId === store.id || editingId === store.id} // Disable if editing name too
                    >
                      <SelectTrigger className="w-[150px] h-8 text-xs"> {/* Adjust size */}
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awaiting approval">Awaiting Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="watchlist">Watchlist</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingId === store.id && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </TableCell>
                {/* Actions Cell */}
                <TableCell className="text-center">
                  {editingId === store.id ? (
                    <div className="flex gap-1 justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-600 hover:text-green-700"
                        onClick={() => handleSaveName(store.id)}
                        disabled={savingNameId === store.id} // Disable save while saving
                      >
                        {savingNameId === store.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-600 hover:text-red-700"
                        onClick={handleCancelEdit}
                        disabled={savingNameId === store.id} // Disable cancel while saving
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEditClick(store)}
                      disabled={!!editingId || !!updatingId} // Disable if any row is being edited/updated
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}