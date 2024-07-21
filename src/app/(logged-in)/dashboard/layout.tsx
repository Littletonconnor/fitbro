'use client'

import '@/styles/globals.css'

import { CircleUser, Home, Menu, Package, Package2, ShoppingCart } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect, usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/sheet'
import { cn } from '@/lib/utils'

interface RootLayoutProps {
  children: React.ReactNode
}

interface NavLinkProps {
  href: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const headerLinks: NavLinkProps[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/workouts', label: 'Workouts', icon: ShoppingCart },
  { href: '/exercises', label: 'Exercises', icon: Package },
]

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'DELETE',
    })

    router.push('/login')
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Fitbro</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {headerLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {headerLinks.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-8 lg:gap-6 lg:px-12 lg:py-6">{children}</main>
      </div>
    </div>
  )
}

function NavLink({ href, label, icon: Icon }: NavLinkProps) {
  const pathname = usePathname()
  const activeLink = headerLinks.find((link) => pathname.endsWith(link.href))

  return (
    <Link
      href={href}
      className={cn(
        activeLink?.href === href &&
          'flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary',
        activeLink?.href !== href &&
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
      )}
    >
      {<Icon className="h-4 w-4" />}
      {label}
    </Link>
  )
}
