import { useState } from 'react'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [effortPoints, setEffortPoints] = useState('1')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const points = Number(effortPoints)

    if (!title.trim() || !description.trim()) {
      setError('Enter a task title and description.')
      return
    }
    if (title.trim().length > 100 || description.trim().length > 500) {
      setError('Keep the title within 100 characters and the description within 500.')
      return
    }
    if (!Number.isInteger(points) || points < 1 || points > 100) {
      setError('Effort points must be a whole number from 1 to 100.')
      return
    }

    onAddTask({ title: title.trim(), description: description.trim(), effortPoints: points })
    setTitle('')
    setDescription('')
    setEffortPoints('1')
    setError('')
  }

  return (
    <form className="task-form" aria-labelledby="add-task-heading" aria-describedby={error ? 'task-form-error' : undefined} onSubmit={handleSubmit} noValidate>
      <h2 id="add-task-heading">Add a task</h2>
      {error && <p id="task-form-error" role="alert">{error}</p>}
      <label htmlFor="task-title">Task title</label>
      <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} required />

      <label htmlFor="task-description">Description</label>
      <textarea id="task-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={3} required />

      <label htmlFor="task-effort">Estimated effort points</label>
      <input id="task-effort" type="number" min="1" max="100" step="1" value={effortPoints} onChange={(event) => setEffortPoints(event.target.value)} aria-describedby="effort-help" required />
      <p id="effort-help" className="note">Choose a whole number from 1 to 100.</p>
      <button type="submit">Add task</button>
    </form>
  )
}

export default TaskForm
