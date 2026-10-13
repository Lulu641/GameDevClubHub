function TaskCard({ title, description, completed, onToggle }) {
  return (
    <li>
      <div>
        <h3>{title}</h3>
        <p className="task-description">{description}</p>
        <p>{completed ? 'Complete' : 'Not started'}</p>
      </div>
      <button
        type="button"
        aria-label={`${completed ? 'Reopen' : 'Mark complete'}: ${title}`}
        onClick={onToggle}
      >
        {completed ? 'Reopen' : 'Mark complete'}
      </button>
    </li>
  )
}

export default TaskCard
