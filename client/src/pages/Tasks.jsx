import TaskList from '../components/TaskList.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskSummary from '../components/TaskSummary.jsx'

function Tasks({ tasks, onToggleTask, onAddTask, onRemoveTask, busy }) {
  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">MAKE THE NEXT MOVE</p><h1>Tasks</h1><p>Break down the big idea. Build one small piece at a time.</p></div>
      </header>
      <TaskSummary tasks={tasks} />
      <div className="tasks-layout">
      <TaskForm onAddTask={onAddTask} busy={busy} />
      <section className="task-collection" aria-labelledby="tasks-heading">
        <div className="collection-heading"><h2 id="tasks-heading">Saved tasks</h2><span className="count-badge">{tasks.length}</span></div>
        <TaskList tasks={tasks} onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} busy={busy} />
        <p className="note">Changes are saved with your project.</p>
      </section>
      </div>
    </>
  )
}

export default Tasks
