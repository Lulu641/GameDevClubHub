import TaskList from '../components/TaskList.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskSummary from '../components/TaskSummary.jsx'

function Tasks({ tasks, onToggleTask, onAddTask, onRemoveTask, busy }) {
  return (
    <>
      <header>
        <p className="eyebrow">JamTrack</p>
        <h1>Tasks</h1>
        <p>Small steps toward our next playable game.</p>
      </header>
      <TaskSummary tasks={tasks} />
      <TaskForm onAddTask={onAddTask} busy={busy} />
      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">Saved tasks</h2>
        <TaskList tasks={tasks} onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} busy={busy} />
        <p className="note">Tasks and completion changes are saved to SQLite.</p>
      </section>
    </>
  )
}

export default Tasks
