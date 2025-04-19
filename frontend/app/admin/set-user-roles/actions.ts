'use server'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache';       // <-- Import revalidatePath
import { redirect } from 'next/navigation';     // <-- Import redirect

export async function setRole(formData: FormData): Promise<void> {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    console.log({ message: res.publicMetadata })
    // 2. Redirect back to the dashboard, causing a reload with fresh data
    redirect('/admin/set-user-roles'); // <-- ADJUST PATH IF NEEDED
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err))
  }
}

export async function removeRole(formData: FormData): Promise<void> {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    console.log({ message: res.publicMetadata })
    // 1. Revalidate the data cache for the dashboard path
    revalidatePath('/admin/set-user-roles'); // <-- ADJUST PATH IF NEEDED

    // 2. Redirect back to the dashboard, causing a reload with fresh data
    redirect('/admin/set-user-roles'); // <-- ADJUST PATH IF NEEDED
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err))
  }
}