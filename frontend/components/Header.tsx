'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { CreateStoreModal } from './CreateStoreModal'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'

const Header = () => {
  const { user } = useUser()
  const role = user?.publicMetadata.role
  if (role==='buyer')
  {
      const isBuyer = true;
  }
  else
  {
    const isBuyer = false;
  }

  return (
    <header className="border-b bg-white">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Storify
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <SignedIn>
                { role === "buyer" ? (
                  <>
                    <CreateStoreModal />
                    <Button className="cursor-pointer"  variant={'outline'}><a href='/buyer/home'>My Acc</a></Button>
                  </>
                  ) : role === "seller" ? (
                    <>
                      <Button className="cursor-pointer" variant={'outline'}><a href='/seller/dashboard'>Switch to Buyer</a></Button>
                    </>
                  ) : (
                    <>
                      
                    </>
                  )
                }  
                <li className="flex items-center">
                  <UserButton />
                </li>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="
                      inline-flex cursor-pointer items-center justify-center 
                      px-4 py-2 font-medium rounded-md transition-colors duration-200 
                      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                      disabled:opacity-50 disabled:pointer-events-none 
                      bg-black text-white"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header