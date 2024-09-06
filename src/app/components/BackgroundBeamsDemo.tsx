import React from "react";
import { BackgroundBeams } from "./ui/BackgroundBeams";
import Link from 'next/link';

export function BackgroundBeamsDemo() {
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <BackgroundBeams className="absolute inset-0 z-0" /> 
      <div className="max-w-2xl mx-auto p-4 relative z-10 text-center">
        <h1 className="text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold">
          InvoiceFlow
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-4 text-md">
          Streamline your invoicing with simplicity and style.
        </p>
        
        <div className="flex justify-center">
        <Link href="/create-invoice" className="group rounded-lg border border-neutral-400 bg-neutral-950 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 px-6 py-2 pr-10 text-lg font-semibold transition duration-150 ease-in-out relative overflow-hidden">
          Create Invoice
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-100 transition-all duration-300 ease-in-out group-hover:right-1">→</span>
        </Link>
      </div>

      </div>
    </div>
  );
}
