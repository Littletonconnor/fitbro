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
