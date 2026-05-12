import { createClient } from '@/lib/supabase/server'
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run middleware on routes that actually need auth checks:
     * - /login (redirect logged-in users to dashboard)
     * - /dashboard/* (protect from unauthenticated access)
     * - /onboarding/* (protect from unauthenticated access)
     * - /checkout/* (protect from unauthenticated access)
     * - /billing/* (protect from unauthenticated access)
     *
     * Excludes: /, /pricing, /privacy, /terms, static assets
     * This ensures back navigation to public pages works without delay.
     */
    '/login',
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/checkout/:path*',
    '/billing/:path*',
  ],
}
