'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Storify
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/sellers">
                  <Button variant="ghost">Im a seller</Button>
                </Link>
              </li>
              <li>
                <Link href="/buyers">
                  <Button variant="ghost">Im a buyer</Button>
                </Link>
              </li>

              <SignedIn>
                <li className="flex items-center">
                  <UserButton />
                </li>
              </SignedIn>
              <SignedOut>
                <li className="flex items-center rounded bg-black px-2 font-bold text-white">
                  <SignInButton mode="modal" />
                </li>
              </SignedOut>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header