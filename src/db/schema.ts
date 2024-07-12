import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIME)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIME)`),
})

export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIME)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIME)`),
})

export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey(),
  workoutId: integer('workout_id')
    .references(() => workouts.id)
    .notNull(),
  name: text('name').notNull(),
  note: text('note').notNull(),
  order: integer('order').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIME)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIME)`),
})

export const sets = sqliteTable('sets', {
  id: integer('id').primaryKey(),
  exerciseId: integer('exercise_id')
    .references(() => exercises.id)
    .notNull(),
  reps: integer('reps').notNull(),
  weight: integer('weight').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIME)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIME)`),
})

export type User = typeof users.$inferSelect
export type Workout = typeof workouts.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Set = typeof sets.$inferSelect
