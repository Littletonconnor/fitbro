'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { db } from '@/db'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export async function authenticate(_currentState: unknown, formData: FormData) {
  const result = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return {
      errors: ['Invalid data submission'],
    }
  }

  const { email, password } = result.data

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (!user) {
    return {
      errors: ['Invalid email or password'],
    }
  }

  const passwordHash = await bcrypt.compare(password, user.passwordHash)

  if (!passwordHash) {
    return {
      errors: ['Invalid email or password'],
    }
  }

  // create user
  // create session
}
