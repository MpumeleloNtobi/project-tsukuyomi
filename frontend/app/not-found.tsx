"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 animate-pulse" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-bounce"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-2xl animate-bounce"
        style={{ animationDuration: "2s", animationDelay: "0.5s" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>


        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
          The page you are looking for has been moved or does not exist.
          <br />
          <span className="text-gray-400">But dont worry, well guide you back home.</span>
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/home">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group"
            >
              <Home className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Take Me Home
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 backdrop-blur-sm">
          <p className="text-gray-400 text-sm">
            <span className="text-purple-400 font-semibold">Fun fact:</span> 404 errors got their name from room 404 at
            CERN, where the original web servers were located. Now you know! ✨
          </p>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
