import * as React from 'react'

import { db } from '@/db'
import { getUserIdFromSession } from '@/lib/session'
import { ExercisesTable } from './table'

export default async function ExercisesPage() {
  const userId = await getUserIdFromSession()
  const result = await db.query.exercises.findMany({
    with: {
      sets: true,
      workout: true,
    },
  })

  const userExercises = result.filter((exercise) => exercise.workout.userId === userId)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Exercises</h1>
      </div>
      <ExercisesTable exercises={userExercises} />
    </div>
  )
}
