function TaskCard({ title, description, status, effortPoints, onToggle, onRemove }) {
  const completed = status === 'Completed'
  return (
    <li className={completed ? 'task-card is-complete' : 'task-card'}>
      <div>
        <h3>{title}</h3>
        <p className="task-description">{description}</p>
        <p>{status} · {effortPoints} effort points</p>
      </div>
      <div className="task-actions">
        <button
          type="button"
          aria-label={`${completed ? 'Reopen' : 'Mark complete'}: ${title}`}
          aria-pressed={completed}
          onClick={onToggle}
        >
          {completed ? 'Reopen' : 'Mark complete'}
        </button>
        <button type="button" className="secondary" aria-label={`Remove: ${title}`} onClick={onRemove}>
          Remove
        </button>
      </div>
    </li>
  )
}

export default TaskCard
