'use client'

import React, { useState } from 'react'

interface Exercise {
  id: number
  name: string
  createdAt: string | null
  updatedAt: string | null
  workoutId: number
  note: string
  order: number
}

interface ExerciseLibraryProps {
  exercises: Exercise[]
  setSelectedExercises: any
}

export function ExerciseLibrary({ exercises, setSelectedExercises }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises((prev: Exercise[]) => [...prev, exercise])
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search Exercises"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 rounded border p-2"
      />
      <ul>
        {filteredExercises.map((exercise) => (
          <li key={exercise.id} className="mb-2">
            <button onClick={() => handleAddExercise(exercise)} className="rounded border p-2">
              {exercise.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
