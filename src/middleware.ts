import { NextRequest } from 'next/server'

import { updateSession } from '@/lib/session'

export function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
