import { cookies } from 'next/headers'

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('session')

  return new Response(null, {
    status: 204,
  })
}

export const dynamic = 'force-dynamic'
