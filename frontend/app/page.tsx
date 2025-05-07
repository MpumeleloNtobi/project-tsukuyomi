import Header from "@/components/Header"
import StoreGallery from "@/components/StoreGallery"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { CartProvider } from "./hooks/use-cart"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
     <CartProvider storeId={""}>
      <Header showCart={true}/>
      </CartProvider>

      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 md:py-16 text-center max-w-5xl mx-auto">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600">
            Launch your hustle with us!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            From 60sixty to Takealot, retail is now online. And Storify is the place to start. 🚀 your hustle in just a few clicks with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-linear-to-r from-gray-300 via-gray-500 to-gray-700 hover:bg-gradient-to-r from-slate-900 to-slate-700 text-white font-medium px-8"
            >
              Start selling now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
    </main>
  )
}
