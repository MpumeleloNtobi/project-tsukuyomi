'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ShoppingCart } from "@/components/Cart"
import Link from 'next/link'
import { CreateStoreModal } from './CreateStoreModal'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { CartProvider } from '@/app/hooks/use-cart'
import Image from 'next/image'
import storify from '@/public/storify.png'
interface headerInterface {
  showCart: boolean;
}
const Header = ({showCart=false}: headerInterface) => {
  const { user } = useUser()
  const role = user?.publicMetadata.role
  return (
    <header className="border-b bg-linear-to-r from-black via-pink-500 to-black px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/home">
          <Image  width={200}className="p-3" alt="logo" src={storify} />
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <SignedIn>
                { role === "buyer" ? (
                  <>
                    <CreateStoreModal />
                  </>
                  ) : role === "seller" ? (
                    <>
                      <Button className="cursor-pointer" variant={'outline'}><a href='/seller/dashboard'>Seller Dashboard</a></Button>
                    </>
                  ) : (
                    <>
                      
                    </>
                  )
                }
                {
                  showCart ? ( <ShoppingCart/> ) : (<></>)
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
    </header>
   
  )
}

export default Header