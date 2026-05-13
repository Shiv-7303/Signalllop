'use client'

import { Nunito, Caveat, Patrick_Hand, Fira_Code } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState } from 'react'
import { Toaster as Sonner } from "@/components/ui/sonner"

const nunito = Nunito({ subsets: ["latin"], variable: '--font-nunito' });
const caveat = Caveat({ subsets: ["latin"], variable: '--font-caveat' });
const patrickHand = Patrick_Hand({ weight: "400", subsets: ["latin"], variable: '--font-patrick' });
const firaCode = Fira_Code({ subsets: ["latin"], variable: '--font-fira' });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${caveat.variable} ${patrickHand.variable} ${firaCode.variable} font-sans bg-[var(--paper-white)] text-[var(--ink-black)]`} suppressHydrationWarning>
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
