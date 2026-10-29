import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from './app.js'
import { openTaskStore } from './database.js'

let directory, databasePath, store, server, baseUrl
async function start() {
  store = openTaskStore(databasePath)
  server = await new Promise((resolve) => {
    const listener = createApp(store).listen(0, '127.0.0.1', () => resolve(listener))
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
}
async function stop() {
  await new Promise((resolve) => server.close(resolve))
  store.close()
}
function send(path, method = 'GET', body) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}
async function add(body = { title: 'Build the first level', effortPoints: 3 }) {
  const response = await send('/api/tasks', 'POST', body)
  assert.equal(response.status, 201)
  return response.json()
}
beforeEach(async () => {
  directory = mkdtempSync(join(tmpdir(), 'jamtrack-api-'))
  databasePath = join(directory, 'nested', 'tasks.sqlite')
  await start()
})
afterEach(async () => {
  await stop()
  rmSync(directory, { recursive: true, force: true })
})

test('initializes a real SQLite file and starts empty without mock tasks', async () => {
  assert.equal(readFileSync(databasePath).subarray(0, 16).toString(), 'SQLite format 3\0')
  const response = await send('/api/tasks')
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /application\/json/)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), [])
})

test('creates a trimmed task with optional description and retrieves the SQLite row', async () => {
  const task = await add({ title: '  Create a jump mechanic  ' })
  assert.equal(task.title, 'Create a jump mechanic')
  assert.equal(task.description, '')
  assert.equal(task.completed, false)
  assert.equal(task.status, 'Not started')
  assert.equal(task.effortPoints, 1)
  assert.ok(Number.isSafeInteger(task.id))
  assert.deepEqual(store.get(task.id), task)
  assert.deepEqual(await (await send('/api/tasks')).json(), [task])
})

test('saves description and effort, generates unique IDs, and accepts duplicate titles', async () => {
  const first = await add({ title: 'Playtest', description: '  Test controls  ', effortPoints: 5 })
  const second = await add({ title: 'Playtest', effortPoints: 2 })
  assert.notEqual(first.id, second.id)
  assert.equal(first.description, 'Test controls')
  assert.equal(first.effortPoints, 5)
  assert.equal(store.list().length, 2)
})

test('parameterized SQL stores SQL-like text literally without affecting the table', async () => {
  const title = "x'); DROP TABLE tasks; --"
  const task = await add({ title, description: "It's a game developer's task." })
  assert.equal(task.title, title)
  assert.equal(store.list()[0].title, title)
  await add()
  assert.equal(store.list().length, 2)
})

test('completion and reopening are stored in SQLite', async () => {
  const task = await add()
  const complete = await send(`/api/tasks/${task.id}/complete`, 'PATCH', { completed: true })
  assert.equal(complete.status, 200)
  assert.equal((await complete.json()).completed, true)
  assert.equal(store.get(task.id).status, 'Completed')
  const reopen = await send(`/api/tasks/${task.id}/complete`, 'PATCH', { completed: false })
  assert.equal((await reopen.json()).completed, false)
  assert.equal(store.get(task.id).status, 'Not started')
})

test('creation and completion survive closing and reopening the server and database', async () => {
  const task = await add()
  await send(`/api/tasks/${task.id}/complete`, 'PATCH', { completed: true })
  await stop()
  await start()
  const saved = await (await send('/api/tasks')).json()
  assert.equal(saved.length, 1)
  assert.equal(saved[0].id, task.id)
  assert.equal(saved[0].completed, true)
})

test('deletion survives reopening SQLite', async () => {
  const task = await add()
  assert.equal((await send(`/api/tasks/${task.id}`, 'DELETE')).status, 204)
  assert.deepEqual(store.list(), [])
  await stop()
  await start()
  assert.deepEqual(await (await send('/api/tasks')).json(), [])
})

for (const body of [null, [], {}, { title: '' }, { title: '  ' }, { title: 4 }, { title: 'x'.repeat(101) }, { title: 'Test', description: 4 }, { title: 'Test', description: 'x'.repeat(501) }, ...[0, -1, 1.5, 101, '3', null].map((effortPoints) => ({ title: 'Test', effortPoints }))]) {
  test(`rejects invalid task input: ${JSON.stringify(body).slice(0, 80)}`, async () => {
    assert.equal((await send('/api/tasks', 'POST', body)).status, 400)
    assert.deepEqual(store.list(), [])
  })
}

test('rejects invalid completion values and IDs without changing tasks', async () => {
  const task = await add()
  for (const value of [undefined, 'true', 1, null]) {
    const body = value === undefined ? {} : { completed: value }
    assert.equal((await send(`/api/tasks/${task.id}/complete`, 'PATCH', body)).status, 400)
  }
  for (const id of ['abc', '0', '-1', '1.5', '9007199254740993']) {
    assert.equal((await send(`/api/tasks/${id}/complete`, 'PATCH', { completed: true })).status, 400)
    assert.equal((await send(`/api/tasks/${id}`, 'DELETE')).status, 400)
  }
  assert.equal(store.get(task.id).completed, false)
})

test('returns JSON errors for missing tasks, unknown routes, and malformed JSON', async () => {
  assert.equal((await send('/api/tasks/999/complete', 'PATCH', { completed: true })).status, 404)
  assert.equal((await send('/api/tasks/999', 'DELETE')).status, 404)
  assert.equal((await send('/api/missing')).status, 404)
  const response = await fetch(`${baseUrl}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' })
  assert.equal(response.status, 400)
  assert.match((await response.json()).error, /valid JSON/)
})
