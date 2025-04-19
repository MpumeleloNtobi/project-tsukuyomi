// src/app/actions.ts (or your relevant actions file)
"use server"

import { revalidatePath } from "next/cache"

// --- Action to update ONLY the status ---
export async function updateStoreStatus(id: string, status: string) {
  // (Keep your existing updateStoreStatus function as it is)
  // ... see previous correct version ...
  const allowedStatuses = ["awaiting approval", "approved", "watchlist", "banned"];
  if (!id || typeof id !== 'string' ) {
    throw new Error("Invalid Store ID provided.");
  }
   if (!status || !allowedStatuses.includes(status)) {
      throw new Error(`Invalid status value. Allowed statuses are: ${allowedStatuses.join(', ')}.`);
   }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${id}`;
    console.log(`Server Action: Calling PUT ${apiUrl} with status: ${status}`);
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });
    if (!response.ok) {
        let errorDetails = '';
        try {
            const errorText = await response.text();
            errorDetails = `: ${errorText}`;
            console.error(`API Error Response (${response.status}):`, errorText);
        } catch (parseError) { console.error("Could not parse error response body:", parseError); }
        throw new Error(`API Error: ${response.status} ${response.statusText}${errorDetails}`);
    }
    const data = await response.json();
    console.log(`Server Action: Store ${id} status updated successfully.`);
    revalidatePath("/stores");
    return { success: true, updatedStore: data };
  } catch (error) {
    console.error("Error in updateStoreStatus Server Action:", error);
    throw new Error("Failed to update store status via Server Action.");
  }
}


// --- NEW Action to update ONLY the name ---
export async function updateStoreName(id: string, name: string) {
  // Basic validation
  if (!id || typeof id !== 'string') {
      throw new Error("Invalid Store ID provided.");
  }
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error("Store name cannot be empty.");
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${id}`;
    console.log(`Server Action: Calling PUT ${apiUrl} with name: ${name}`);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }), // Send trimmed name
    });

    if (!response.ok) {
        let errorDetails = '';
        try {
            const errorText = await response.text();
            errorDetails = `: ${errorText}`;
            console.error(`API Error Response (${response.status}):`, errorText);
        } catch (parseError) { console.error("Could not parse error response body:", parseError); }
        throw new Error(`API Error: ${response.status} ${response.statusText}${errorDetails}`);
    }

    const data = await response.json();
    console.log(`Server Action: Store ${id} name updated successfully.`);
    revalidatePath("/stores"); // Revalidate to show changes
    return { success: true, updatedStore: data }; // Return updated store data
  } catch (error) {
    console.error("Error in updateStoreName Server Action:", error);
    throw new Error("Failed to update store name via Server Action.");
  }
}