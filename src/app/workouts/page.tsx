import { db } from '@/db'
import { users } from '@/db/schema'

export default async function WorkoutsPage() {
  const result = await db.select().from(users)
  console.log('RESULT', result)
  return <div>Workouts</div>
}
