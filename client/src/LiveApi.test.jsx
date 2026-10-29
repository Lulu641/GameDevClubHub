import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from '../../server/app.js'
import { openTaskStore } from '../../server/database.js'
import App from './App.jsx'

const realFetch = globalThis.fetch
let directory, store, server, baseUrl
beforeAll(async () => {
  directory = mkdtempSync(join(tmpdir(), 'jamtrack-ui-'))
  store = openTaskStore(join(directory, 'tasks.sqlite'))
  server = await new Promise((resolve) => {
    const listener = createApp(store).listen(0, '127.0.0.1', () => resolve(listener))
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve))
  store.close()
  rmSync(directory, { recursive: true, force: true })
})

it('creates through React and real Express/SQLite, reloads, completes, reloads again, and deletes', async () => {
  vi.stubGlobal('fetch', (path, options) => realFetch(new URL(path, baseUrl), options))
  function mount() { return render(<MemoryRouter><App /></MemoryRouter>) }
  let current = mount()
  await screen.findByText('No tasks yet. Add your first task to get started.')
  fireEvent.click(screen.getByRole('link', { name: 'Tasks' }))
  fireEvent.change(screen.getByLabelText('Task title'), { target: { value: 'Build a boss fight' } })
  fireEvent.change(screen.getByLabelText('Estimated effort points'), { target: { value: '5' } })
  fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
  await screen.findByRole('heading', { name: 'Build a boss fight' })
  const id = store.list()[0].id
  expect(store.get(id).completed).toBe(false)

  current.unmount()
  current = mount() // Full React remount makes a fresh GET, like a page reload.
  await screen.findByRole('heading', { name: 'Build a boss fight' })
  fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Build a boss fight' }))
  await screen.findByRole('button', { name: 'Reopen: Build a boss fight' })
  expect(store.get(id).completed).toBe(true)

  current.unmount()
  mount()
  await screen.findByRole('button', { name: 'Reopen: Build a boss fight' })
  const region = screen.getByRole('region', { name: 'Task summary' })
  expect(within(region).getByText('Completed tasks').nextElementSibling.textContent).toBe('1')
  expect(within(region).getByRole('progressbar').value).toBe(1)
  fireEvent.click(screen.getByRole('button', { name: 'Remove: Build a boss fight' }))
  await waitFor(() => expect(screen.getByText('No tasks yet. Add your first task to get started.')).toBeTruthy())
  expect(store.list()).toEqual([])
})
