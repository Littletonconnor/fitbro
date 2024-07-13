import bcrypt from 'bcryptjs'

import { db } from '@/db'
import {
  Exercise,
  exercises as exercisesSchema,
  Set,
  sets as setsSchema,
  users as usersSchema,
  workouts as workoutsSchema,
  type User,
  type Workout,
} from '@/db/schema'
import { faker } from '@faker-js/faker'

function randomInt(min = 3, max = 5) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const USERS = 3
const WORKOUTS = randomInt()
const EXERCISES = randomInt()
const SETS = randomInt()

async function seed() {
  console.time('🌱 Database has been seeded.')
  await deleteData()
  const users = await createUsers()
  const workouts = await createWorkouts(users)
  const exercises = await createExercises(workouts)
  await createSets(exercises)
  console.timeEnd('🌱 Database has been seeded.')
}

async function createUsers() {
  console.time('👤 Created users')
  const users = await db
    .insert(usersSchema)
    .values(Array.from({ length: USERS }, createUser))
    .returning()
  console.timeEnd('👤 Created users')
  return users
}

async function createWorkouts(users: User[]) {
  console.time('💪 Created workouts')
  const workouts = await db
    .insert(workoutsSchema)
    .values(
      Array.from({ length: WORKOUTS }, () => {
        const randomUser = users[randomInt(0, users.length - 1)]
        return {
          ...createWorkout(),
          userId: randomUser.id,
        }
      }),
    )
    .returning()
  console.timeEnd('💪 Created workouts')
  return workouts
}

export async function createExercises(workouts: Workout[]) {
  console.time('🏋️‍♀️ Created exercises')
  const exercises = await db
    .insert(exercisesSchema)
    .values(
      Array.from({ length: EXERCISES }, () => {
        const randomWorkout = workouts[randomInt(0, workouts.length - 1)]

        return {
          ...createExercise(),
          workoutId: randomWorkout.id,
        }
      }),
    )
    .returning()
  console.timeEnd('🏋️‍♀️ Created exercises')
  return exercises
}

export async function createSets(exercises: Exercise[]) {
  console.time('📶 Created Sets')
  await db.insert(setsSchema).values(
    Array.from({ length: SETS }, () => {
      const randomExercise = exercises[randomInt(0, exercises.length - 1)]
      return {
        ...createSet(),
        exerciseId: randomExercise.id,
      }
    }),
  )
  console.timeEnd('📶 Created Sets')
}

async function deleteData() {
  console.time('🧹 Cleaned up the database')
  await db.delete(setsSchema)
  await db.delete(exercisesSchema)
  await db.delete(workoutsSchema)
  await db.delete(usersSchema)
  console.timeEnd('🧹 Cleaned up the database')
}

function createUser(): User {
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: bcrypt.hashSync(faker.internet.password(), 10),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
  }
}

function createWorkout(): Workout {
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    userId: randomInt(0, Number.MAX_SAFE_INTEGER),
    name: faker.word.noun(),
    description: faker.lorem.sentence(),
    date: faker.date.past().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
  }
}

function createExercise(): Exercise {
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    workoutId: randomInt(0, Number.MAX_SAFE_INTEGER),
    name: faker.word.noun(),
    order: faker.number.int({ min: 1, max: 10 }),
    note: faker.lorem.sentence(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
  }
}

function createSet(): Set {
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    exerciseId: randomInt(0, Number.MAX_SAFE_INTEGER),
    reps: faker.number.int({ min: 8, max: 12 }),
    weight: faker.number.int({ min: 100, max: 200 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
  }
}

seed()
