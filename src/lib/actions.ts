'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { db } from '@/db'
import { setSession } from './session'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter (a-z, A-Z)' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit (0-9)' }),
})

export async function authenticate(_currentState: unknown, formData: FormData) {
  const result = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    return {
      success: false,
      fieldErrors,
    }
  }

  const { email, password } = result.data

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (!user) {
    return {
      success: false,
      errors: ['Invalid email or password'],
    }
  }

  const passwordHash = await bcrypt.compare(password, user.passwordHash)

  if (!passwordHash) {
    return {
      success: false,
      errors: ['Invalid email or password'],
    }
  }

  setSession(user)
  redirect('/dashboard')
}
