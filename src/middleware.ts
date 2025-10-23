import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const token = request.cookies.get('admin_token')?.value

  // Allow home page and static assets freely
  if (
    url.pathname === '/' ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // If token exists, allow access everywhere
  if (token) {
    return NextResponse.next()
  }

  // If token missing and trying to access any protected route → redirect to home
  url.pathname = '/'
  return NextResponse.redirect(url)
}

export const config = {
  // Apply middleware to all pages except static files and api routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)']
}
