import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/auth')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (toSet) => {
            toSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response = NextResponse.next({ request })
              response.cookies.set(name, value, options)
            })
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: admin, error: roleError } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email ?? '')
      .maybeSingle()
    if (roleError || !admin) {
      return pathname.startsWith('/admin/api/')
        ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        : new NextResponse('Geen toegang tot beheer.', { status: 403 })
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
