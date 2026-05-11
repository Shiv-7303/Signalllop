'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState } from 'react'
import { Toaster as Sonner } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }))

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
