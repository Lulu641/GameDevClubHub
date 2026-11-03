import Icon from './Icon.jsx'

function TaskSummary({ tasks }) {
  const completed = tasks.filter((task) => task.status === 'Completed').length
  const effort = tasks.reduce((total, task) => total + task.effortPoints, 0)

  return (
    <section aria-label="Task summary" aria-live="polite">
      <dl className="task-summary">
        <div><dt>Total tasks</dt><dd>{tasks.length}</dd><Icon name="tasks" /></div>
        <div className="completed-metric"><dt>Completed tasks</dt><dd>{completed}</dd><Icon name="check" /></div>
        <div><dt>Remaining tasks</dt><dd>{tasks.length - completed}</dd><Icon name="flag" /></div>
        <div><dt>Effort points</dt><dd>{effort}</dd><Icon name="bolt" /></div>
      </dl>
      <div className="progress-panel">
        <div className="progress-copy"><span className="feature-icon"><Icon name="bolt" /></span><div><p>Your momentum</p><label htmlFor="task-progress">{completed} of {tasks.length} tasks complete</label></div></div>
        <div className="progress-meter"><span aria-hidden="true">{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</span><progress id="task-progress" value={completed} max={Math.max(tasks.length, 1)} aria-label="Task completion" aria-valuetext={`${completed} of ${tasks.length} tasks complete`} /></div>
      </div>
    </section>
  )
}

export default TaskSummary
