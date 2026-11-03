import Icon from './Icon.jsx'

function TaskCard({ title, description, status, effortPoints, onToggle, onRemove, busy }) {
  const completed = status === 'Completed'
  return (
    <li className={completed ? 'task-card is-complete' : 'task-card'}>
      <div className="task-card-content">
        <p className="task-meta"><span className={`status-badge ${completed ? 'done' : ''}`}>{completed && <Icon name="check" size={13} />}{status}</span><span className="effort-badge"><Icon name="bolt" size={14} />{effortPoints} effort points</span></p>
        <h3>{title}</h3>
        {description && <p className="task-description">{description}</p>}
      </div>
      <div className="task-actions">
        <button
          type="button"
          aria-label={`${completed ? 'Reopen' : 'Mark complete'}: ${title}`}
          aria-pressed={completed}
          disabled={busy}
          onClick={onToggle}
        >
          <Icon name={completed ? 'reopen' : 'check'} size={16} />{completed ? 'Reopen' : 'Mark complete'}
        </button>
        <button type="button" className="remove-button" aria-label={`Remove: ${title}`} onClick={onRemove} disabled={busy}>
          <Icon name="trash" size={16} />Remove
        </button>
      </div>
    </li>
  )
}

export default TaskCard
