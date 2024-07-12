import bcrypt from 'bcryptjs'

import { db } from '@/db'
import {
  users,
  users as usersSchema,
  workouts,
  workouts as workoutsSchema,
  type User,
  type Workout,
} from '@/db/schema'
import { faker } from '@faker-js/faker'

function randomInt(min = 1, max = 4) {
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
  console.time('🏋️‍♀️ Created workouts')
  for (const user of users) {
    await db.insert(workoutsSchema).values(
      Array.from({ length: WORKOUTS }, () => {
        return {
          id: randomInt(0, Number.MAX_SAFE_INTEGER),
          userId: user.id,
          name: faker.word.noun(),
          description: faker.lorem.sentence(),
          date: faker.date.past().toISOString(),
          createdAt: faker.date.past().toISOString(),
          updatedAt: faker.date.past().toISOString(),
        }
      }),
    )
  }
  console.timeEnd('🏋️‍♀️ Created workouts')
}

async function deleteData() {
  console.time('🧹 Cleaned up the database')
  await db.delete(usersSchema)
  await db.delete(workoutsSchema)
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

seed()
