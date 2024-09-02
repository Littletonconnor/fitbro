import { NextRequest } from 'next/server'

import { getSession, updateSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return Response.redirect(new URL('/login', request.url))
  }

  return updateSession()
}

export const config = {
  matcher: ['/dashboard/:path*', '/workouts/:path*', '/exercises/:path*'],
}
