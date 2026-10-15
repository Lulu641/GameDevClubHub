import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import app from '../../server/app.js'
import App from './App.jsx'

const realFetch = globalThis.fetch
let server
let baseUrl
beforeAll(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener))
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
afterAll(() => new Promise((resolve) => server.close(resolve)))

it('loads the real Express response into React and manages it without changing API seed data', async () => {
  // Relative browser URLs need an origin in Node's simulated DOM.
  vi.stubGlobal('fetch', (path, options) => realFetch(new URL(path, baseUrl), options))
  render(<MemoryRouter initialEntries={['/tasks']}><App /></MemoryRouter>)
  await screen.findByRole('heading', { name: 'Create player movement' })
  expect(screen.getAllByRole('listitem')).toHaveLength(5)
  fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Create player movement' }))
  const summary = screen.getByRole('region', { name: 'Task summary' })
  expect(within(summary).getByText('Completed tasks').nextElementSibling.textContent).toBe('1')
  const response = await realFetch(`${baseUrl}/api/tasks`)
  expect((await response.json()).every((task) => task.status === 'Not started')).toBe(true)
})
