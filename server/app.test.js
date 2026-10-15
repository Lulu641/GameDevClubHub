import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import app from './app.js'

const seed = JSON.parse(readFileSync(new URL('./data/tasks.json', import.meta.url), 'utf8'))
let server
let baseUrl
before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener))
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
})
after(() => new Promise((resolve) => server.close(resolve)))

test('GET /api/tasks responds over real HTTP with valid JSON and all task fields', async () => {
  const response = await fetch(`${baseUrl}/api/tasks`)
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /application\/json/)
  const tasks = await response.json()
  assert.deepEqual(tasks, seed)
  assert.ok(tasks.length >= 5)
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length)
  for (const task of tasks) {
    assert.ok(task.title.trim())
    assert.ok(task.description.trim())
    assert.ok(['Not started', 'Completed'].includes(task.status))
    assert.ok(Number.isInteger(task.effortPoints) && task.effortPoints > 0 && task.effortPoints <= 100)
  }
})

test('unknown API paths respond with 404', async () => {
  assert.equal((await fetch(`${baseUrl}/api/missing`)).status, 404)
})
