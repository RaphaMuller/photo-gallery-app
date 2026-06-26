import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Dev/demo escape hatch: skip the auth gate entirely. Off unless the
  // env flag is explicitly "true". Never enable in production.
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'

  if (!bypassAuth) {
    if (!user && request.nextUrl.pathname.startsWith('/gallery')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // If user is already logged in, they shouldn't see the login/landing page, they should go to gallery.
    if (user && request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/gallery'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
