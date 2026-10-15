import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router'
import App from './App.jsx'
import TaskCard from './components/TaskCard.jsx'
import sampleTasks from '../../server/data/tasks.json'

let consoleError
let consoleWarn

beforeAll(() => {
  sampleTasks.forEach(Object.freeze)
  Object.freeze(sampleTasks)
})

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => sampleTasks })))
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
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

function fillForm(title = 'Record game audio', description = 'Record a jump sound.', points = '4') {
  fireEvent.change(screen.getByLabelText('Task title'), { target: { value: title } })
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: description } })
  fireEvent.change(screen.getByLabelText('Estimated effort points'), { target: { value: points } })
}

const initialPoints = sampleTasks.reduce((total, task) => total + task.effortPoints, 0)

describe('Lesson 10 task management', () => {
  it('loads and maps all API tasks with unique IDs and all required fields', async () => {
    await renderTasks()
    expect(sampleTasks.length).toBeGreaterThanOrEqual(5)
    expect(new Set(sampleTasks.map((task) => task.id)).size).toBe(sampleTasks.length)
    expect(screen.getAllByRole('listitem')).toHaveLength(sampleTasks.length)
    for (const task of sampleTasks) {
      const card = screen.getByRole('heading', { name: task.title }).closest('li')
      expect(within(card).getByText(task.description)).toBeTruthy()
      expect(within(card).getByText(`${task.status} · ${task.effortPoints} effort points`)).toBeTruthy()
    }
    expect(summary('Total tasks')).toBe(sampleTasks.length)
    expect(summary('Effort points')).toBe(initialPoints)
  })

  it('reuses TaskCard props and both parent callbacks', () => {
    const onToggle = vi.fn()
    const onRemove = vi.fn()
    render(<ul><TaskCard title="Record audio" description="Capture a jump sound." status="Completed" effortPoints={4} onToggle={onToggle} onRemove={onRemove} /></ul>)
    expect(screen.getByText('Capture a jump sound.')).toBeTruthy()
    expect(screen.getByText('Completed · 4 effort points')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Reopen: Record audio' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove: Record audio' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('adds trimmed tasks with unique IDs, clears the form, and updates totals', async () => {
    await renderTasks()
    fillForm('  Record game audio  ')
    const submit = fireEvent.submit(screen.getByRole('form', { name: 'Add a task' }))
    expect(submit).toBe(false) // preventDefault blocks native page submission.
    expect(screen.getByRole('heading', { name: 'Record game audio' })).toBeTruthy()
    expect(screen.getByLabelText('Task title').value).toBe('')
    expect(summary('Total tasks')).toBe(sampleTasks.length + 1)
    expect(summary('Effort points')).toBe(initialPoints + 4)
    fillForm('Record game audio')
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    expect(summary('Total tasks')).toBe(sampleTasks.length + 2)
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove: Record game audio' })[0])
    expect(summary('Total tasks')).toBe(sampleTasks.length + 1)
    expect(screen.getAllByRole('heading', { name: 'Record game audio' })).toHaveLength(1)
  })

  it('rejects blank titles and descriptions', async () => {
    await renderTasks()
    fillForm('   ', 'Some description')
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('alert').textContent).toMatch(/title and description/)
    fillForm('Record audio', '  ')
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('alert').textContent).toMatch(/title and description/)
    expect(summary('Total tasks')).toBe(sampleTasks.length)
  })

  it.each(['', '0', '-2', '1.5', '101'])('rejects invalid effort points: %s', async (points) => {
    await renderTasks()
    fillForm('Record audio', 'Capture a sound.', points)
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('alert').textContent).toMatch(/whole number from 1 to 100/)
    expect(summary('Effort points')).toBe(initialPoints)
  })

  it('rejects overlong task text even if submitted programmatically', async () => {
    await renderTasks()
    fillForm('x'.repeat(101))
    fireEvent.submit(screen.getByRole('form', { name: 'Add a task' }))
    expect(screen.getByRole('alert').textContent).toMatch(/100 characters/)
    expect(summary('Total tasks')).toBe(sampleTasks.length)
  })

  it('toggles completion immutably and keeps unrelated tasks unchanged', async () => {
    await renderTasks()
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Create player movement' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Design the main menu' }))
    expect(summary('Completed tasks')).toBe(2)
    expect(summary('Remaining tasks')).toBe(sampleTasks.length - 2)
    fireEvent.click(screen.getByRole('button', { name: 'Reopen: Create player movement' }))
    expect(summary('Completed tasks')).toBe(1)
    expect(summary('Effort points')).toBe(initialPoints)
    expect(screen.getByRole('button', { name: 'Mark complete: Test the first level' })).toBeTruthy()
    expect(sampleTasks.every((task) => task.status === 'Not started')).toBe(true)
  })

  it('removes completed tasks and updates totals, then handles empty state and recovery', async () => {
    await renderTasks()
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Create player movement' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove: Create player movement' }))
    expect(summary('Completed tasks')).toBe(0)
    expect(summary('Effort points')).toBe(initialPoints - sampleTasks[0].effortPoints)
    for (const task of sampleTasks.slice(1)) {
      fireEvent.click(screen.getByRole('button', { name: `Remove: ${task.title}` }))
    }
    expect(screen.getByText('No tasks yet. Add your first task to get started.')).toBeTruthy()
    expect(summary('Total tasks')).toBe(0)
    expect(summary('Effort points')).toBe(0)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.queryByText('No tasks yet. Add your first task to get started.')).toBeNull()
    expect(summary('Total tasks')).toBe(1)
    expect(summary('Effort points')).toBe(4)
  })

  it('shares all edits with Dashboard and retains the navigation DOM across routes', async () => {
    window.history.replaceState({}, '', '/tasks')
    render(<BrowserRouter><App /></BrowserRouter>)
    await screen.findByRole('heading', { name: 'Tasks', level: 1 })
    const navigation = screen.getByRole('navigation')
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Record game audio' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove: Create player movement' }))
    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    expect(window.location.pathname).toBe('/')
    expect(summary('Total tasks')).toBe(sampleTasks.length)
    expect(summary('Completed tasks')).toBe(1)
    expect(summary('Remaining tasks')).toBe(sampleTasks.length - 1)
    expect(summary('Effort points')).toBe(initialPoints + 4 - sampleTasks[0].effortPoints)
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(window.location.pathname).toBe('/about')
    fireEvent.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(summary('Completed tasks')).toBe(1)
    expect(screen.getByRole('navigation')).toBe(navigation)
  })

  it('shows loading until the request resolves', async () => {
    let respond
    fetch.mockImplementationOnce(() => new Promise((resolve) => { respond = resolve }))
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('status').textContent).toBe('Loading tasks…')
    respond({ ok: true, json: async () => sampleTasks })
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 })
    expect(screen.queryByText('Loading tasks…')).toBeNull()
  })

  it('handles a failed request and retries successfully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network unavailable'))
    render(<MemoryRouter><App /></MemoryRouter>)
    await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 })
    expect(summary('Total tasks')).toBe(sampleTasks.length)
  })

  it('handles non-success HTTP responses', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 503 })
    render(<MemoryRouter><App /></MemoryRouter>)
    expect((await screen.findByRole('alert')).textContent).toMatch(/Could not load tasks/)
  })

  it.each([
    { unexpected: 'object' },
    [{ ...sampleTasks[0], effortPoints: '5' }],
    [{ ...sampleTasks[0], status: 'invalid' }],
    [sampleTasks[0], sampleTasks[0]],
  ].map((data) => ({ data })))('handles malformed API task data %#', async ({ data }) => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => data })
    render(<MemoryRouter><App /></MemoryRouter>)
    await screen.findByRole('alert')
  })

  it('handles invalid JSON', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON') } })
    render(<MemoryRouter><App /></MemoryRouter>)
    await screen.findByRole('alert')
  })

  it('handles an empty API array', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
    await renderTasks()
    expect(screen.getByText('No tasks yet. Add your first task to get started.')).toBeTruthy()
    expect(summary('Total tasks')).toBe(0)
  })

  it('aborts an in-flight request when App unmounts', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}))
    const result = render(<MemoryRouter><App /></MemoryRouter>)
    const signal = fetch.mock.calls[0][1].signal
    result.unmount()
    expect(signal.aborted).toBe(true)
  })

  it('restores API sample tasks when the whole app remounts', async () => {
    const first = await renderTasks()
    fireEvent.click(screen.getByRole('button', { name: 'Remove: Create player movement' }))
    first.unmount()
    await renderTasks()
    expect(summary('Total tasks')).toBe(sampleTasks.length)
  })

  it('shows unknown-URL fallback and a working route back to Dashboard', async () => {
    render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeTruthy())
  })
})
