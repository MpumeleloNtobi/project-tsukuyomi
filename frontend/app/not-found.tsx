"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <h1 className="text-9xl md:text-[10rem] font-extrabold text-gray-800 dark:text-gray-200 mb-4">
          404
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Page Not Found
        </p>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page youre looking for doesnt exist or has been moved.
          <br />
          Dont worry, we can help you find your way back.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/home" passHref>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg transition-colors duration-300 flex items-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Take Me Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 px-8 py-4 text-lg rounded-lg transition-colors duration-300"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}