import TaskCard from '../components/TaskCard.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskSummary from '../components/TaskSummary.jsx'

function Tasks({ tasks, onToggleTask, onAddTask, onRemoveTask }) {
  return (
    <>
      <header>
        <p className="eyebrow">Game Development Club</p>
        <h1>Tasks</h1>
        <p>Small steps toward our next playable game.</p>
      </header>

      <TaskSummary tasks={tasks} />
      <TaskForm onAddTask={onAddTask} />
      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">This week's tasks</h2>
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add your first task to get started.</p>
        ) : <ul className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              effortPoints={task.effortPoints}
              onToggle={() => onToggleTask(task.id)}
              onRemove={() => onRemoveTask(task.id)}
            />
          ))}
        </ul>}
        <p className="note">Demo tasks reset when you refresh the page.</p>
      </section>
    </>
  )
}

export default Tasks
