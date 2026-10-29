import TaskCard from './TaskCard.jsx'

function TaskList({ tasks, onToggleTask, onRemoveTask, busy }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add your first task to get started.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          status={task.status}
          effortPoints={task.effortPoints}
          onToggle={() => onToggleTask(task.id)}
          onRemove={() => onRemoveTask(task.id)}
          busy={busy}
        />
      ))}
    </ul>
  )
}

export default TaskList
