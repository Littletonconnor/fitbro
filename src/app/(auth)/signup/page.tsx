'use client'

import * as React from 'react'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'

import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { signup } from '@/lib/actions'

export default function LoginForm() {
  const [state, dispatch] = useFormState(signup, undefined)

  return (
    <div className="w-full py-20">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {state?.errors && <p className="mb-4 text-sm text-red-600">{state.errors[0]}</p>}
          <form action={dispatch} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  aria-describedby="firstName-error"
                  aria-invalid={!!state?.fieldErrors?.firstName}
                />
                {state?.fieldErrors?.firstName && (
                  <p id="firstName-error" className="px-1 text-xs text-red-600">
                    {state.fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  aria-describedby="lastName-error"
                  placeholder="Doe"
                  required
                  aria-invalid={!!state?.fieldErrors?.lastName}
                />
                {state?.fieldErrors?.lastName && (
                  <p id="lastName-error" className="px-1 text-xs text-red-600">
                    {state.fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="john@example.com"
                aria-describedby="email-error"
                aria-invalid={!!state?.fieldErrors?.email}
                type="email"
                required
              />
              {state?.fieldErrors?.email && (
                <p id="email-error" className="px-1 text-xs text-red-600">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                aria-describedby="password-error"
                aria-invalid={!!state?.fieldErrors?.password}
              />
              {state?.fieldErrors?.password && (
                <p id="password-error" className="px-1 text-xs text-red-600">
                  {state.fieldErrors.password}
                </p>
              )}
            </div>
            <SignUpButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SignUpButton() {
  const { pending } = useFormStatus()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (pending) {
      event.preventDefault()
    }
  }

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
      aria-disabled={pending}
      onClick={handleClick}
    >
      Create an account
    </Button>
  )
}
