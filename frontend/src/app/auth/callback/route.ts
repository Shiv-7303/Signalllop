import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import api from '@/lib/api'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      try {
        // Call backend /auth/verify to create/sync user record
        // The api client will automatically attach the Bearer token from the session
        const verifyResp = await api.post('/auth/verify', {}, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        
        // Logic from 5.9: If no business -> onboarding, else dashboard
        const { user } = verifyResp.data
        // We need to check if user has businesses. 
        // Let's call /businesses/ to check
        const bizResp = await api.get('/businesses/', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        
        if (bizResp.data.length === 0) {
          return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
        } else {
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
        }
      } catch (err) {
        console.error('Error during auth callback verification:', err)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=verification_failed`)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
