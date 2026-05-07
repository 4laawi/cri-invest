import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-up');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isAdminDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard');
  const isProtectedPage = 
    request.nextUrl.pathname.startsWith('/projets') || 
    request.nextUrl.pathname.startsWith('/profile') || 
    request.nextUrl.pathname.startsWith('/rendez-vous');

  const userRole = user?.user_metadata?.role;

  // If trying to access admin dashboard but not admin
  if (isAdminDashboard && userRole !== 'admin' && user?.email !== 'admin@cri.ma') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // If not logged in and trying to access protected user pages
  if (!user && isProtectedPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If logged in and trying to access auth pages (sign-up)
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
