import { Link } from 'react-router'
import TaskSummary from '../components/TaskSummary.jsx'
import TaskList from '../components/TaskList.jsx'
import Icon from '../components/Icon.jsx'

function Dashboard({ tasks, onToggleTask, onRemoveTask, busy }) {
  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">THE BIG PICTURE</p><h1>Dashboard</h1><p>Your next playable build, one finished task at a time.</p></div>
        <Link className="button button-primary" to="/tasks#add-task-heading"><Icon name="plus" /> Add a task</Link>
      </header>
      <TaskSummary tasks={tasks} />
      <div className="collection-heading"><div><p className="eyebrow">KEEP THE BUILD MOVING</p><h2>Saved tasks</h2></div><Link className="text-link" to="/tasks">Manage tasks <Icon name="arrow" size={17} /></Link></div>
      <TaskList tasks={tasks} onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} busy={busy} />
    </>
  )
}

export default Dashboard
