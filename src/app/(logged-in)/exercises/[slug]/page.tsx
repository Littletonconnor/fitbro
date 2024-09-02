import { redirect } from 'next/navigation'

import { db } from '@/db'
import { getUserIdFromSession } from '@/lib/session'
import { OneRepMaxChart, SetChart, WeightChart } from './chart'

interface PageProps {
  params: { slug: string }
}

export default async function Page({ params }: PageProps) {
  const userId = await getUserIdFromSession()
  const exercise = await db.query.exercises.findFirst({
    where: (exercises, { eq }) => eq(exercises.id, Number(params.slug)),
  })

  if (!exercise) {
    return redirect('/404')
  }

  const exerciseName = exercise.name
  const exercises = await db.query.exercises.findMany({
    where: (exercises, { eq }) => eq(exercises.name, exerciseName),
    with: {
      sets: true,
      workout: true,
    },
  })

  const userExercises = exercises.filter((exercise) => exercise.workout.userId === userId)

  return (
    <div className="flex w-full max-w-5xl flex-col">
      <h1 className="text-3xl font-bold capitalize leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        {exerciseName}
      </h1>
      <p className="text-foreground mb-4 mt-2 text-lg font-light lg:mb-12">Progression over time</p>
      <div className="space-y-12">
        <WeightChart exercises={userExercises} />
        <OneRepMaxChart />
        <SetChart />
      </div>
    </div>
  )
}
