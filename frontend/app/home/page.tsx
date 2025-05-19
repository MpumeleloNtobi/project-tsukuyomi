"use client"
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Header from "@/components/Header"
import StoreGallery from "@/components/StoreGallery"
import { CreateStoreModal } from '@/components/CreateStoreModal'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Footer from "@/components/Footer"
import Link from "next/link"

export default function Home() {
  const { user } = useUser()
  const role = user?.publicMetadata.role

  const router = useRouter()

const handleClick = () => {
  if (role === "seller") {
    router.push("/seller/store")
  } else {
    router.push("/seller/store/create") 
  }
}


  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header showCart={false}/>
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 md:py-16 text-center max-w-5xl mx-auto">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600">
            Launch your hustle with us!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            From 60sixty to Takealot, retail is now online. And Storify is the place to start. 🚀 your hustle in just a few clicks with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
  {!user ? (
    /* 1. Not signed in */
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
  ) : role === "seller" ? (
    /* 2. Signed in as seller */
    <Button
      size="lg"
      onClick={() => router.push("/seller/store")}
      className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-medium px-8"
    >
      My Store
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    /* 3. Signed in as buyer */
     <CreateStoreModal />
  )}
</div>

        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">We power some amazing 🇿🇦 stores.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We encourage you to check them out and support them.
            </p>
          </div>
          <StoreGallery />
        </div>
      </section>
       <Footer />
    </main>
  )
}
