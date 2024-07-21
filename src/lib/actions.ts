'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { db } from '@/db'
import { users } from '@/db/schema'
import { createdAt, updatedAt } from './date'
import { removeSession, setSession } from './session'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter (a-z, A-Z)' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit (0-9)' }),
})

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter (a-z, A-Z)' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit (0-9)' }),
})

export async function signup(_currentState: unknown, formData: FormData) {
  const result = signupSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
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

  const { firstName, lastName, email, password } = result.data

  const maybeUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (maybeUser) {
    return {
      success: false,
      errors: ['User already exists'],
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db
    .insert(users)
    .values({
      name: `${firstName} ${lastName}`,
      email,
      passwordHash: hashedPassword,
      createdAt: createdAt(),
      updatedAt: updatedAt(),
    })
    .returning()

  setSession(user[0])
  redirect('/dashboard')
}

export async function authenticate(_currentState: unknown, formData: FormData) {
  const result = loginSchema.safeParse({
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

export async function logout() {
  console.log('REMOVING SESSION')
  await removeSession()
  redirect('/login')
}
