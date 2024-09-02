import { JWTPayload, jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

import { User } from '@/db/schema'

// Session duration: 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

const JWT_SECRET = process.env.JWT_SECRET
const key = new TextEncoder().encode(JWT_SECRET)

async function encrypt(payload: any, expires: Date) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expires.getTime() / 1000)) // Convert to seconds
    .sign(key)
}

async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  })
  return payload as JWTPayload
}

async function getSession() {
  const session = cookies().get('session')?.value
  if (!session) {
    return null
  }
  return await decrypt(session)
}

async function getUserIdFromSession() {
  const session = await getSession()
  const userId = session?.userId as number
  if (!userId) {
    redirect('/login')
  }

  return userId
}

async function setSession(user: User) {
  const expirationTime = new Date(Date.now() + SESSION_DURATION)
  const session = await encrypt({ userId: user.id }, expirationTime)

  cookies().set('session', session, {
    expires: expirationTime,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

async function updateSession() {
  const session = cookies().get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)
  const expirationTime = new Date(Date.now() + SESSION_DURATION)

  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    expires: expirationTime,
    value: await encrypt({ userId: parsed.userId }, expirationTime),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  return res
}

function removeSession() {
  cookies().delete('session')
}

export { getSession, setSession, updateSession, removeSession, getUserIdFromSession }
