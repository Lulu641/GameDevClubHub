import { useState } from 'react'
import { Link, Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import About from './pages/About.jsx'
import initialTasks from './data/tasks.json'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(initialTasks)

  function toggleTask(id) {
    // Replace the array and the changed object instead of mutating state.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} onToggleTask={toggleTask} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </main>
  )
}

export default App
