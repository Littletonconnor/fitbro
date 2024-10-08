'use client'

import { Inter as FontSans } from 'next/font/google'

import '@/styles/globals.css'

import * as React from 'react'

import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('bg-background min-h-screen font-sans antialiased', fontSans.variable)}>
        {children}
      </body>
    </html>
  )
}
