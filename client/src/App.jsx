import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import About from './pages/About.jsx'
import { fetchTasks, createTask, setTaskCompletion, deleteTask } from './api/tasks.js'
import Icon, { BrandMark } from './components/Icon.jsx'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTasks() {
      try {
        const data = await fetchTasks(controller.signal)
        if (controller.signal.aborted) return
        setTasks(data)
        setLoadState('ready')
      } catch {
        if (!controller.signal.aborted) setLoadState('error')
      }
    }

    loadTasks()
    return () => controller.abort()
  }, [loadAttempt])

  const taskFeedback = loadState === 'loading' ? (
    <p role="status">Loading tasks…</p>
  ) : (
    <div className="load-error" role="alert">
      <p>Could not load tasks. Make sure the backend is running, then try again.</p>
      <button type="button" onClick={() => {
        setLoadState('loading')
        setLoadAttempt((attempt) => attempt + 1)
      }}>Try again</button>
    </div>
  )

  async function addTask(task) {
    setBusy(true)
    setActionError('')
    try {
      const saved = await createTask(task)
      setTasks((currentTasks) => [...currentTasks, saved])
    } finally {
      setBusy(false)
    }
  }

  async function removeTask(id) {
    setBusy(true)
    setActionError('')
    try {
      await deleteTask(id)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    } catch (error) {
      setActionError(error.message || 'Could not remove the task.')
    } finally {
      setBusy(false)
    }
  }

  async function toggleTask(id) {
    const task = tasks.find((current) => current.id === id)
    setBusy(true)
    setActionError('')
    try {
      const saved = await setTaskCompletion(id, !task.completed)
      setTasks((currentTasks) => currentTasks.map((current) => current.id === id ? saved : current))
    } catch (error) {
      setActionError(error.message || 'Could not update the task.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace">Skip to content</a>
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="JamTrack home"><BrandMark /><span>JamTrack<span className="brand-dot">.</span></span></Link>
        <p className="nav-caption">YOUR WORKSPACE</p>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/" end><Icon name="dashboard" />Dashboard</NavLink>
          <NavLink to="/tasks"><Icon name="tasks" />Tasks</NavLink>
          <NavLink to="/about"><Icon name="info" />About</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className={`workspace-status ${loadState}`} aria-live="polite">
            <span className="status-dot" />
            <div><strong>{busy ? 'Saving your changes' : loadState === 'ready' ? 'Workspace loaded' : loadState === 'loading' ? 'Loading workspace' : 'Tasks unavailable'}</strong><p>{loadState === 'ready' ? `${tasks.length} saved ${tasks.length === 1 ? 'task' : 'tasks'}` : 'Your next build starts here.'}</p></div>
          </div>
          <p className="rail-footer">Made for game makers.</p>
        </div>
      </aside>
      <div className="workspace">
        <header className="workspace-topbar"><span>YOUR GAME. YOUR NEXT MOVE.</span><span className="topbar-tagline"><span className="tiny-square" /> A little progress, every session.</span></header>
        <main id="workspace" tabIndex={-1}>
      {actionError && <p role="alert">{actionError}</p>}

      <Routes>
        <Route path="/" element={loadState === 'ready' ? (
          <Dashboard tasks={tasks} onToggleTask={toggleTask} onRemoveTask={removeTask} busy={busy} />
        ) : taskFeedback} />
        <Route path="/tasks" element={loadState === 'ready' ? (
          <Tasks tasks={tasks} onToggleTask={toggleTask} onAddTask={addTask} onRemoveTask={removeTask} busy={busy} />
        ) : taskFeedback} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
        </main>
        <footer className="workspace-footer"><span>JamTrack</span><span>Keep making things.</span></footer>
      </div>
    </div>
  )
}

export default App
