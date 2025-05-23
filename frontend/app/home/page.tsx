// components/Home.jsx (or pages/index.jsx)
"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Header from "@/components/Header";
import StoreGallery from "@/components/StoreGallery";
import { CreateStoreModal } from "@/components/CreateStoreModal";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useTheme } from "next-themes"; // Import useTheme
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import Team03Page from "@/components/team-03/team-03";

export default function Home() {
  const { user } = useUser();
  const role = user?.publicMetadata.role;
  const router = useRouter();
  const { theme, setTheme } = useTheme(); // Use the useTheme hook

  const handleClick = () => {
    if (role === "seller") {
      router.push("/seller/store");
    } else {
      router.push("/seller/store/create");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-black text-gray-900 dark:text-gray-100">

      <Header showCart={false} />
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 md:py-16 text-center max-w-5xl mx-auto">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600 dark:from-rose-400 dark:to-purple-500">
           The future of hustle is here.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
         Traditional e-commerce holds you back<br/>
         Storify is the next-gen marketplace built for your hustle. <br/>
      Allowing you to launch your empire, your way.<br/>
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
                      bg-black text-white dark:bg-gray-700 dark:text-gray-50"
                >
                  Sign In
                </button>
              </SignInButton>
            ) : role === "seller" ? (
              /* 2. Signed in as seller */
              <Button
                size="lg"
                onClick={() => router.push("/seller/store")}
                className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-medium px-8
                           dark:from-slate-700 dark:to-slate-500 dark:hover:from-slate-600 dark:hover:to-slate-400"
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

      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              We power 🇿🇦 's best hustlers.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
             Check out their stores!
            </p>
          </div>
          <StoreGallery /> {/* Ensure StoreGallery also has dark mode styles */}
        </div>
      </section>
      <Team03Page></Team03Page>
      <VelocityScroll>Launch your hustle</VelocityScroll>
      <Footer /> 
    </main>
  );
}