import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import About from './pages/About.jsx'
import { fetchTasks } from './api/tasks.js'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [loadAttempt, setLoadAttempt] = useState(0)

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

  function addTask(task) {
    setTasks((currentTasks) => [
      ...currentTasks,
      { ...task, id: crypto.randomUUID(), status: 'Not started' },
    ])
  }

  function removeTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  function toggleTask(id) {
    // Replace the array and the changed object instead of mutating state.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'Completed' ? 'Not started' : 'Completed' }
          : task,
      ),
    )
  }

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={loadState === 'ready' ? <Dashboard tasks={tasks} /> : taskFeedback} />
        <Route path="/tasks" element={loadState === 'ready' ? (
          <Tasks tasks={tasks} onToggleTask={toggleTask} onAddTask={addTask} onRemoveTask={removeTask} />
        ) : taskFeedback} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </main>
  )
}

export default App
