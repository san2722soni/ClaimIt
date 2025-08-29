"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SplashScreen() {
  return (
    <div className="min-h-dvh w-full bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Visual: centered GIF with overlay text */}
        <div className="relative w-64 h-64 md:w-72 md:h-72">
          {/* GIF */}
          <img
            src="/images/search-splash.gif"
            alt="Search animation"
            className="w-full h-full object-contain select-none pointer-events-none"
          />

          {/* Center title */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-semibold text-blue-600 drop-shadow-sm">Claimit</span>
          </div>

          {/* Phrase from left */}
          <span
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-4 text-base md:text-lg font-medium text-gray-700 animate-slide-in-left"
            aria-hidden="true"
          >
            Lost It
          </span>

          {/* Phrase from bottom */}
          <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-4 text-base md:text-lg font-medium text-gray-700 animate-slide-in-up [animation-delay:200ms]"
            aria-hidden="true"
          >
            List it
          </span>

          {/* Phrase from right */}
          <span
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-4 text-base md:text-lg font-semibold text-emerald-600 animate-slide-in-right [animation-delay:400ms]"
            aria-hidden="true"
          >
            Claim it
          </span>
        </div>

        {/* Optional continue button */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Enter</Button>
          </Link>
        </div>
      </div>

      {/* Local, scoped animations */}
      <style jsx global>{`
        @keyframes slide-in-left {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slide-in-right {
          0% {
            transform: translateX(120%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slide-in-up {
          0% {
            transform: translateY(120%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 600ms ease-out both;
        }
        .animate-slide-in-right {
          animation: slide-in-right 600ms ease-out both;
        }
        .animate-slide-in-up {
          animation: slide-in-up 600ms ease-out both;
        }
      `}</style>
    </div>
  )
}
