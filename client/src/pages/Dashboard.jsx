import { Link } from 'react-router'
import TaskSummary from '../components/TaskSummary.jsx'
import TaskList from '../components/TaskList.jsx'

function Dashboard({ tasks, onToggleTask, onRemoveTask, busy }) {
  return (
    <>
      <header>
        <p className="eyebrow">JamTrack</p>
        <h1>Dashboard</h1>
        <p>Track your game development tasks and progress.</p>
      </header>
      <TaskSummary tasks={tasks} />
      <p className="dashboard-link"><Link to="/tasks">Manage club tasks</Link></p>
      <h2>Saved tasks</h2>
      <TaskList tasks={tasks} onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} busy={busy} />
    </>
  )
}

export default Dashboard
