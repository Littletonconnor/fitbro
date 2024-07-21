import { JWTPayload, jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { User } from '@/db/schema'

const JWT_SECRET = process.env.JWT_SECRET
const key = new TextEncoder().encode(JWT_SECRET)

async function encrypt(payload: any, expires: Date) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key)
}

async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  })
  return payload as JWTPayload
}

async function getSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) {
    return null
  }
  return await decrypt(session)
}

async function setSession(user: User) {
  const session = await encrypt({ user }, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

  cookies().set('session', session, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)

  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    value: await encrypt(parsed, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  return res
}

function removeSession() {
  cookies().delete('session')
}

export { getSession, setSession, updateSession, removeSession }
