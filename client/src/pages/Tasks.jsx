import TaskCard from '../components/TaskCard.jsx'

function Tasks({ tasks, onToggleTask }) {
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <>
      <header>
        <p className="eyebrow">Game Development Club</p>
        <h1>Tasks</h1>
        <p>Small steps toward our next playable game.</p>
      </header>

      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">This week's tasks</h2>
        <p role="status">{completedCount} of {tasks.length} tasks complete</p>
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              onToggle={() => onToggleTask(task.id)}
            />
          ))}
        </ul>
        <p className="note">Demo tasks reset when you refresh the page.</p>
      </section>
    </>
  )
}

export default Tasks
