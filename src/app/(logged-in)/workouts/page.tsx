import { db } from '@/db'
import { exercises as dbExercises } from '@/db/schema'
import { ExerciseLibrary } from './exercise-library'

export default async function CreateWorkoutPage() {
  const distinctExerciseNames = await db
    .selectDistinct({ name: dbExercises.name })
    .from(dbExercises)
    .all()

  const exercises = await db.select().from(dbExercises).all()

  const filteredExercises = exercises.filter((exercise) =>
    distinctExerciseNames.some((name) => name.name === exercise.name),
  )

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        {/* <WorkoutForm selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} /> */}
      </div>
      <div className="w-1/3 p-4">
        <ExerciseLibrary exercises={filteredExercises} />
      </div>
    </div>
  )
}
