import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema'

const sqlite = new Database('./drizzle/sqlite.db')

export const db = drizzle(sqlite, {
  schema,
})
