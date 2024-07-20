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
    <div className="flex flex-col w-full max-w-5xl">
      <h1 className="capitalize text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        {exerciseName}
      </h1>
      <p className="text-lg font-light text-foreground mt-2 mb-4 lg:mb-12">Progression over time</p>
      <div className="space-y-12">
        <WeightChart exercises={results} />
        <OneRepMaxChart />
        <SetChart />
      </div>
    </div>
  )
}
