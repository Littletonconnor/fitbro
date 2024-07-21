'use client'

import * as React from 'react'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'

import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { authenticate } from '@/lib/actions'

export default function Login() {
  const [state, dispatch] = useFormState(authenticate, undefined)

  return (
    <div className="w-full py-20">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {state?.errors && <p className="mb-4 text-sm text-red-600">{state.errors[0]}</p>}
          <form action={dispatch} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                aria-invalid={!!state?.fieldErrors?.email}
                aria-describedby="email-error"
                type="email"
              />
              {state?.fieldErrors?.email && (
                <p id="email-error" className="px-1 text-xs text-red-600">
                  {state?.fieldErrors.email[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                aria-describedby="password-error"
                aria-invalid={!!state?.fieldErrors?.password}
              />
              {state?.fieldErrors?.password && (
                <p id="password-error" className="px-1 text-xs text-red-600">
                  {state?.fieldErrors.password[0]}
                </p>
              )}
            </div>
            <LoginButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoginButton() {
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
      Log in
    </Button>
  )
}

export const dynamic = 'force-dynamic'
