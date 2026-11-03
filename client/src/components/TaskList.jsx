import TaskCard from './TaskCard.jsx'
import Icon from './Icon.jsx'

function TaskList({ tasks, onToggleTask, onRemoveTask, busy }) {
  if (tasks.length === 0) {
    return <div className="empty-state"><span className="feature-icon"><Icon name="flag" size={24} /></span><h3>Your next build starts here.</h3><p>No tasks yet. Add your first task to get started.</p></div>
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
