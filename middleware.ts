import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request: NextRequest) {
  // Check if the route is admin-only
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                 request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = verifyToken(token);
      const response = await fetch(`${request.nextUrl.origin}/api/users/${decoded.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const user = await response.json();
      
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
}; 