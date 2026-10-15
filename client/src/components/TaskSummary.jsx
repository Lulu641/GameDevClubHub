function TaskSummary({ tasks }) {
  const completed = tasks.filter((task) => task.status === 'Completed').length
  const effort = tasks.reduce((total, task) => total + task.effortPoints, 0)

  return (
    <section aria-label="Task summary" aria-live="polite">
      <dl className="task-summary">
        <div><dt>Total tasks</dt><dd>{tasks.length}</dd></div>
        <div><dt>Completed tasks</dt><dd>{completed}</dd></div>
        <div><dt>Remaining tasks</dt><dd>{tasks.length - completed}</dd></div>
        <div><dt>Effort points</dt><dd>{effort}</dd></div>
      </dl>
    </section>
  )
}

export default TaskSummary
