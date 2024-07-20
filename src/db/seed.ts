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
const WORKOUTS = randomInt()
const EXERCISES = randomInt(20, 20)
const SETS = randomInt(3, 3)

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
  const setValues = []
  for (let i = 0; i < EXERCISES; i++) {
    for (let j = 0; j < SETS; j++) {
      setValues.push({
        ...createSet(),
        exerciseId: exercises[i].id,
      })
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
  return {
    id: randomInt(0, Number.MAX_SAFE_INTEGER),
    userId: randomInt(0, Number.MAX_SAFE_INTEGER),
    name: FAKE_DATA.workouts.names[randomInt(0, FAKE_DATA.workouts.names.length - 1)],
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
    name: FAKE_DATA.exercises.names[randomInt(0, FAKE_DATA.exercises.names.length - 1)],
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

try {
  seed()
} catch (e) {
  console.error('Oh no! The seed script failed', e)
  process.exit(1)
}
