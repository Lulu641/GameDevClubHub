import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router'
import App from './App.jsx'
import TaskCard from './components/TaskCard.jsx'
import sampleTasks from './data/tasks.json'

afterEach(cleanup)

beforeAll(() => {
  // Any accidental mutation of the imported task data will fail these tests.
  sampleTasks.forEach(Object.freeze)
  Object.freeze(sampleTasks)
})

function renderTasks() {
  return render(<MemoryRouter initialEntries={['/tasks']}><App /></MemoryRouter>)
}

describe('GameDevClubHub milestones', () => {
  it('provides at least five valid tasks with unique IDs', () => {
    expect(sampleTasks.length).toBeGreaterThanOrEqual(5)
    expect(new Set(sampleTasks.map((task) => task.id)).size).toBe(sampleTasks.length)
    for (const task of sampleTasks) {
      expect(task.title.trim()).not.toBe('')
      expect(task.description.trim()).not.toBe('')
      expect(typeof task.completed).toBe('boolean')
    }
  })

  it('renders every JSON task with its description', () => {
    renderTasks()
    expect(screen.getAllByRole('listitem')).toHaveLength(sampleTasks.length)
    for (const task of sampleTasks) {
      expect(screen.getByRole('heading', { name: task.title })).toBeTruthy()
      expect(screen.getByText(task.description)).toBeTruthy()
    }
  })

  it('renders TaskCard props and calls its parent callback', () => {
    const onToggle = vi.fn()
    render(<ul><TaskCard title="Record game audio" description="Capture a jump sound." completed={true} onToggle={onToggle} /></ul>)
    expect(screen.getByText('Capture a jump sound.')).toBeTruthy()
    expect(screen.getByText('Complete')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Reopen: Record game audio' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('completes two tasks, reopens one, and leaves other tasks unchanged', () => {
    renderTasks()
    expect(screen.getByRole('status').textContent).toBe(`0 of ${sampleTasks.length} tasks complete`)
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Create player movement' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Design the main menu' }))
    expect(screen.getByRole('status').textContent).toBe(`2 of ${sampleTasks.length} tasks complete`)
    fireEvent.click(screen.getByRole('button', { name: 'Reopen: Create player movement' }))
    expect(screen.getByRole('status').textContent).toBe(`1 of ${sampleTasks.length} tasks complete`)
    const thirdCard = screen.getByRole('heading', { name: 'Test the first level' }).closest('li')
    expect(within(thirdCard).getByText('Not started')).toBeTruthy()
    expect(sampleTasks.every((task) => task.completed === false)).toBe(true)
  })

  it('keeps completion state and the navigation element across route changes', () => {
    window.history.replaceState({}, '', '/tasks')
    render(<BrowserRouter><App /></BrowserRouter>)
    const navigation = screen.getByRole('navigation')
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Create player movement' }))
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(window.location.pathname).toBe('/about')
    expect(screen.getByRole('heading', { name: 'About', level: 1 })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(window.location.pathname).toBe('/tasks')
    expect(screen.getByRole('status').textContent).toBe(`1 of ${sampleTasks.length} tasks complete`)
    expect(screen.getByRole('navigation')).toBe(navigation)
  })

  it('starts with fresh demo data when the whole app is remounted', () => {
    const first = renderTasks()
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Create player movement' }))
    first.unmount()
    renderTasks()
    expect(screen.getByRole('status').textContent).toBe(`0 of ${sampleTasks.length} tasks complete`)
  })

  it('shows a recovery link for an unknown URL', () => {
    render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeTruthy()
  })
})
