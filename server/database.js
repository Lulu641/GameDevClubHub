import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const defaultDatabasePath = join(dirname(fileURLToPath(import.meta.url)), 'data', 'jamtrack.sqlite')

export function openTaskStore(filename = defaultDatabasePath) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
  const database = new DatabaseSync(filename)
  database.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 100),
      description TEXT NOT NULL DEFAULT '' CHECK(length(description) <= 500),
      completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
      effort_points INTEGER NOT NULL DEFAULT 1 CHECK(effort_points BETWEEN 1 AND 100)
    ) STRICT;
  `)

  const list = database.prepare('SELECT * FROM tasks ORDER BY id')
  const get = database.prepare('SELECT * FROM tasks WHERE id = ?')
  const insert = database.prepare('INSERT INTO tasks (title, description, effort_points) VALUES (?, ?, ?)')
  const complete = database.prepare('UPDATE tasks SET completed = ? WHERE id = ?')
  const remove = database.prepare('DELETE FROM tasks WHERE id = ?')

  function toTask(row) {
    if (!row) return undefined
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: Boolean(row.completed),
      status: row.completed ? 'Completed' : 'Not started',
      effortPoints: row.effort_points,
    }
  }

  return {
    list: () => list.all().map(toTask),
    get: (id) => toTask(get.get(id)),
    create: ({ title, description, effortPoints }) => {
      const result = insert.run(title, description, effortPoints)
      return toTask(get.get(Number(result.lastInsertRowid)))
    },
    setCompleted: (id, completed) => {
      const result = complete.run(completed ? 1 : 0, id)
      return result.changes ? toTask(get.get(id)) : undefined
    },
    remove: (id) => remove.run(id).changes > 0,
    close: () => database.close(),
  }
}
