import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const { pathname } = request.nextUrl

  // Define paths that are protected
  const protectedPaths = ['/dashboard', '/admin', '/eCommerce', '/account', '/cms']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  // If trying to access protected route without token
  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If already logged in and trying to access login page
  if (pathname === '/login' && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/crm'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/eCommerce/:path*',
    '/account/:path*',
    '/cms/:path*',
    '/login',
  ],
}
