import bcrypt from 'bcryptjs'

import { db } from '@/db'
import {
  Exercise,
  exercises as exercisesSchema,
  sets as setsSchema,
  users as usersSchema,
  workouts as workoutsSchema,
  type Set,
  type User,
  type Workout,
} from '@/db/schema'
import { faker } from '@faker-js/faker'
import { FAKE_DATA } from './seed-utils'

function randomInt(min = 3, max = 5) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const USERS = 3
const WORKOUTS = randomInt(5, 10)
const EXERCISES = randomInt(5, 10)
const SETS = randomInt(3, 5)

const PERSONAL_WORKOUTS = 30
const HISTORICAL_DAYS = 180

async function seed() {
  console.time('🌱 Database has been seeded.')
  await deleteData()
  const users = await createUsers()
  for (const user of users) {
    const workouts = await createWorkouts(user)
    const exercises = await createExercises(workouts)
    await createSets(exercises)
  }
  console.timeEnd('🌱 Database has been seeded.')
}

async function createUsers() {
  console.time('👤 Created users')
  const users = await db
    .insert(usersSchema)
    .values(Array.from({ length: USERS }, createUser))
    .returning()
  const personalUser = await createPersonalUser()
  console.timeEnd('👤 Created users')
  return [...personalUser, ...users]
}

async function createWorkouts(user: User) {
  console.time(`💪 Created workouts for user ${user.id}`)
  const workouts = await db
    .insert(workoutsSchema)
    .values(
      Array.from({ length: WORKOUTS }, () => ({
        ...createWorkout(),
        userId: user.id,
      })),
    )
    .returning()
  console.timeEnd(`💪 Created workouts for user ${user.id}`)
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
  const setValues = []
  for (const exercise of exercises) {
    let weight = faker.number.int({ min: 100, max: 200 })
    for (let j = 0; j < SETS; j++) {
      setValues.push({
        ...createSet(),
        exerciseId: exercise.id,
        weight: weight,
      })
      weight += faker.number.int({ min: -5, max: 5 }) // Simulate slow linear progression
    }
  }
  const sets = await db.insert(setsSchema).values(setValues).returning()
  console.timeEnd('📶 Created Sets')
  return sets
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
    passwordHash: bcrypt.hashSync('root-123', 10),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
  }
}

function createWorkout(): Workout {
  const workoutName = FAKE_DATA.workouts.names[randomInt(0, FAKE_DATA.workouts.names.length - 1)]
  const description = `A comprehensive ${workoutName} workout targeting specific muscle groups for optimal results.`
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    userId: randomInt(0, Number.MAX_SAFE_INTEGER),
    name: workoutName,
    description: description,
    date: faker.date.recent().toISOString(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }
}

function createExercise(): Exercise {
  const exerciseName = FAKE_DATA.exercises.names[randomInt(0, FAKE_DATA.exercises.names.length - 1)]
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    workoutId: randomInt(0, Number.MAX_SAFE_INTEGER),
    name: exerciseName,
    order: randomInt(1, 10),
    note: `Perform ${exerciseName} with proper form for maximum efficiency.`,
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }
}

function createSet(daysBack = 0): Set {
  const date = faker.date.past({ refDate: new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000) })
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    exerciseId: randomInt(0, Number.MAX_SAFE_INTEGER),
    reps: faker.number.int({ min: 8, max: 12 }),
    weight: faker.number.int({ min: 100, max: 200 }),
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  }
}

async function createPersonalUser() {
  console.time('👤 Created personal user with workouts')
  const user = await db
    .insert(usersSchema)
    .values({
      ...createUser(),
      name: 'Littleton Connor',
      email: 'littletonconnor@gmail.com',
      passwordHash: bcrypt.hashSync('root-123', 10),
    })
    .returning()

  const workouts = Array.from({ length: PERSONAL_WORKOUTS }, () => ({
    ...createWorkout(),
    userId: user[0].id,
  }))
  await db.insert(workoutsSchema).values(workouts)

  let exercises: Exercise[] = []
  for (const workout of workouts) {
    for (let i = 0; i < EXERCISES; i++) {
      exercises.push({ ...createExercise(), workoutId: workout.id })
    }
  }

  await db.insert(exercisesSchema).values(exercises)

  const sets: Set[] = []
  for (const exercise of exercises) {
    let weight = faker.number.int({ min: 100, max: 200 })
    for (let i = 0; i < SETS; i++) {
      sets.push({ ...createSet(HISTORICAL_DAYS), exerciseId: exercise.id, weight: weight })
      weight += faker.number.int({ min: -5, max: 5 }) // Simulate slow linear progression
    }
  }
  await db.insert(setsSchema).values(sets)
  console.timeEnd('👤 Created personal user with workouts')
  return user
}

try {
  seed()
} catch (e) {
  console.error('Oh no! The seed script failed.', e)
  process.exit(1)
}
