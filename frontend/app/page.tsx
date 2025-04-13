import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome the Storify platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Sign up as a buyer or seller to start exploring the platform. If you are an admin, you can
                  manage users and their roles.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/qa">
                  <Button size="lg">Start Exploring</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full items-center justify-center bg-gray-100 py-6 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            (c) 2024 Q&A platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
