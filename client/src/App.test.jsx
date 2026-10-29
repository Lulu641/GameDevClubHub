import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router'
import App from './App.jsx'
import fixtures from '../../server/test/fixtures/tasks.json'

let rows, nextId, consoleError, consoleWarn
function response(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => structuredClone(body) }
}
beforeEach(() => {
  rows = structuredClone(fixtures)
  nextId = 6
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn(async (path, options = {}) => {
    if (!options.method) return response(rows)
    if (options.method === 'POST') {
      const task = { ...JSON.parse(options.body), id: nextId++, completed: false, status: 'Not started' }
      rows = [...rows, task]
      return response(task, 201)
    }
    const id = Number(path.split('/')[3])
    if (options.method === 'PATCH') {
      const { completed } = JSON.parse(options.body)
      rows = rows.map((task) => task.id === id ? { ...task, completed, status: completed ? 'Completed' : 'Not started' } : task)
      return response(rows.find((task) => task.id === id))
    }
    rows = rows.filter((task) => task.id !== id)
    return response(null, 204)
  }))
})
afterEach(() => {
  cleanup()
  expect(consoleError).not.toHaveBeenCalled()
  expect(consoleWarn).not.toHaveBeenCalled()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
async function renderTasks() {
  const result = render(<MemoryRouter initialEntries={['/tasks']}><App /></MemoryRouter>)
  await screen.findByRole('heading', { name: 'Tasks', level: 1 })
  return result
}
function summary(label) {
  const region = screen.getByRole('region', { name: 'Task summary' })
  return Number(within(region).getByText(label).nextElementSibling.textContent)
}
function fillForm(title = 'Record audio', description = '', points = '4') {
  fireEvent.change(screen.getByLabelText('Task title'), { target: { value: title } })
  fireEvent.change(screen.getByLabelText('Description (optional)'), { target: { value: description } })
  fireEvent.change(screen.getByLabelText('Estimated effort points'), { target: { value: points } })
}
async function idle() {
  await waitFor(() => expect(document.querySelector('button[disabled], fieldset[disabled]')).toBeNull())
}
async function click(name) {
  fireEvent.click(screen.getByRole('button', { name }))
  await idle()
}

describe('JamTrack core task workflow', () => {
  it('maps tasks returned by the API into reusable cards', async () => {
    await renderTasks()
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    for (const task of fixtures) {
      const card = screen.getByRole('heading', { name: task.title }).closest('li')
      expect(within(card).getByText(task.description)).toBeTruthy()
      expect(within(card).getByText(`${task.status} · ${task.effortPoints} effort points`)).toBeTruthy()
    }
    expect(summary('Total tasks')).toBe(5)
    expect(summary('Effort points')).toBe(18)
  })

  it('saves an optional-description task through POST and uses its server ID', async () => {
    await renderTasks()
    fillForm('  Record audio  ')
    expect(fireEvent.submit(screen.getByRole('form', { name: 'Add a task' }))).toBe(false)
    await screen.findByRole('heading', { name: 'Record audio' })
    await idle()
    expect(fetch).toHaveBeenCalledWith('/api/tasks', expect.objectContaining({ method: 'POST', body: JSON.stringify({ title: 'Record audio', description: '', effortPoints: 4 }) }))
    expect(screen.getByLabelText('Task title').value).toBe('')
    expect(summary('Total tasks')).toBe(6)
    expect(summary('Effort points')).toBe(22)
    await click('Mark complete: Record audio')
    expect(fetch).toHaveBeenCalledWith('/api/tasks/6/complete', expect.objectContaining({ method: 'PATCH', body: '{"completed":true}' }))
    expect(summary('Completed tasks')).toBe(1)
  })

  it('does not show an unsaved task and disables duplicate submissions while saving', async () => {
    await renderTasks()
    let finish
    fetch.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve }))
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('button', { name: 'Saving…' }).closest('fieldset').disabled).toBe(true)
    expect(summary('Total tasks')).toBe(5)
    finish(response({ id: 6, title: 'Record audio', description: '', effortPoints: 4, completed: false, status: 'Not started' }, 201))
    await screen.findByRole('heading', { name: 'Record audio' })
    await idle()
  })

  it('keeps form input and unchanged totals when saving fails, then allows retry', async () => {
    await renderTasks()
    fetch.mockResolvedValueOnce(response({ error: 'Could not save the task.' }, 500))
    fillForm()
    await click('Add task')
    expect(screen.getByRole('alert').textContent).toMatch(/Could not save/)
    expect(screen.getByLabelText('Task title').value).toBe('Record audio')
    expect(summary('Total tasks')).toBe(5)
    await click('Add task')
    expect(summary('Total tasks')).toBe(6)
  })

  it('rejects a blank title and overlong text before calling the API', async () => {
    await renderTasks()
    const initialCalls = fetch.mock.calls.length
    fillForm('   ')
    await click('Add task')
    expect(screen.getByRole('alert').textContent).toMatch(/task title/)
    fillForm('x'.repeat(101))
    await click('Add task')
    expect(screen.getByRole('alert').textContent).toMatch(/100 characters/)
    fillForm('Audio', 'x'.repeat(501))
    await click('Add task')
    expect(fetch.mock.calls.length).toBe(initialCalls)
  })

  it.each(['', '0', '-2', '1.5', '101'])('rejects invalid effort points: %s', async (points) => {
    await renderTasks()
    fillForm('Record audio', '', points)
    await click('Add task')
    expect(screen.getByRole('alert').textContent).toMatch(/whole number from 1 to 100/)
    expect(summary('Effort points')).toBe(18)
  })

  it('completes and reopens tasks using server responses and updates progress', async () => {
    await renderTasks()
    await click('Mark complete: Create player movement')
    await click('Mark complete: Design the main menu')
    expect(summary('Completed tasks')).toBe(2)
    expect(summary('Remaining tasks')).toBe(3)
    expect(screen.getByRole('progressbar', { name: 'Task completion' }).value).toBe(2)
    expect(screen.getByRole('progressbar').max).toBe(5)
    await click('Reopen: Create player movement')
    expect(summary('Completed tasks')).toBe(1)
    expect(screen.getByRole('button', { name: 'Mark complete: Test the first level' })).toBeTruthy()
  })

  it('retains task state if completion or deletion fails', async () => {
    await renderTasks()
    fetch.mockResolvedValueOnce(response({ error: 'Update failed.' }, 500))
    await click('Mark complete: Create player movement')
    expect(screen.getByRole('alert').textContent).toBe('Update failed.')
    expect(summary('Completed tasks')).toBe(0)
    fetch.mockResolvedValueOnce(response({ error: 'Delete failed.' }, 500))
    await click('Remove: Create player movement')
    expect(screen.getByRole('alert').textContent).toBe('Delete failed.')
    expect(summary('Total tasks')).toBe(5)
  })

  it('deletes tasks through the API, updates totals, and handles empty state', async () => {
    await renderTasks()
    await click('Mark complete: Create player movement')
    await click('Remove: Create player movement')
    expect(summary('Completed tasks')).toBe(0)
    expect(summary('Effort points')).toBe(13)
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', expect.objectContaining({ method: 'DELETE' }))
    for (const task of fixtures.slice(1)) await click(`Remove: ${task.title}`)
    expect(screen.getByText('No tasks yet. Add your first task to get started.')).toBeTruthy()
    expect(summary('Total tasks')).toBe(0)
    expect(summary('Effort points')).toBe(0)
    expect(screen.getByRole('progressbar').value).toBe(0)
    fillForm()
    await click('Add task')
    expect(summary('Total tasks')).toBe(1)
    expect(summary('Effort points')).toBe(4)
  })

  it('displays saved cards and correct progress on Dashboard while preserving routes', async () => {
    window.history.replaceState({}, '', '/tasks')
    render(<BrowserRouter><App /></BrowserRouter>)
    await screen.findByRole('heading', { name: 'Tasks', level: 1 })
    const navigation = screen.getByRole('navigation')
    await click('Mark complete: Create player movement')
    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    expect(window.location.pathname).toBe('/')
    expect(summary('Completed tasks')).toBe(1)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'Reopen: Create player movement' })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(window.location.pathname).toBe('/about')
    fireEvent.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(screen.getByRole('navigation')).toBe(navigation)
    expect(summary('Completed tasks')).toBe(1)
  })

  it('shows loading until the database response arrives', async () => {
    let finish
    fetch.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve }))
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('status').textContent).toBe('Loading tasks…')
    finish(response(rows))
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 })
  })

  it('handles a failed load and retries successfully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network unavailable'))
    render(<MemoryRouter><App /></MemoryRouter>)
    await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 })
  })

  it.each([response({}, 503), response({ unexpected: 'object' }), response([{ ...fixtures[0], completed: 'true' }]), response([fixtures[0], fixtures[0]])])('handles invalid or failed API responses %#', async (data) => {
    fetch.mockResolvedValueOnce(data)
    render(<MemoryRouter><App /></MemoryRouter>)
    await screen.findByRole('alert')
  })

  it('shows an empty state when SQLite has no tasks', async () => {
    rows = []
    await renderTasks()
    expect(screen.getByText('No tasks yet. Add your first task to get started.')).toBeTruthy()
    expect(summary('Total tasks')).toBe(0)
  })

  it('aborts a request on unmount', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}))
    const result = render(<MemoryRouter><App /></MemoryRouter>)
    const signal = fetch.mock.calls[0][1].signal
    result.unmount()
    expect(signal.aborted).toBe(true)
  })

  it('recovers from an unknown URL using existing navigation', async () => {
    render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 })
  })
})
