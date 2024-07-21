import { sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { exercises } from '@/db/schema'
import { OneRepMaxChart, SetChart, WeightChart } from './chart'

interface PageProps {
  params: { slug: string }
}

export default async function Page({ params }: PageProps) {
  const result = await db
    .select()
    .from(exercises)
    .where(sql`${exercises.id} = ${params.slug}`)

  if (!result.length) {
    return redirect('/404')
  }

  const results = await db.query.exercises.findMany({
    where: (exercises, { eq }) => eq(exercises.name, result[0].name),
    with: {
      sets: true,
    },
  })

  const exerciseName = result[0].name
  return (
    <div className="flex w-full max-w-5xl flex-col">
      <h1 className="text-3xl font-bold capitalize leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        {exerciseName}
      </h1>
      <p className="text-foreground mb-4 mt-2 text-lg font-light lg:mb-12">Progression over time</p>
      <div className="space-y-12">
        <WeightChart exercises={results} />
        <OneRepMaxChart />
        <SetChart />
      </div>
    </div>
  )
}
