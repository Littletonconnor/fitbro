import Link from 'next/link'

export default function Homepage() {
  return (
    <div className="container mx-auto py-10">
      <h1>Landing Page</h1>
      <Link href="/login" className="border border-zinc-500 px-2">
        Login
      </Link>
    </div>
  )
}
