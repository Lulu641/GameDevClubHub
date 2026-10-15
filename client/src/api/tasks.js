export async function fetchTasks(signal) {
  const response = await fetch('/api/tasks', { signal })
  if (!response.ok) throw new Error(`Task request failed (${response.status}).`)

  const tasks = await response.json()
  if (!Array.isArray(tasks) || tasks.some((task) =>
    !task || (typeof task.id !== 'number' && typeof task.id !== 'string') ||
    typeof task.title !== 'string' || !task.title.trim() ||
    typeof task.description !== 'string' || !task.description.trim() ||
    !['Not started', 'Completed'].includes(task.status) ||
    !Number.isInteger(task.effortPoints) || task.effortPoints < 1 || task.effortPoints > 100,
  ) || new Set(tasks.map((task) => task.id)).size !== tasks.length) {
    throw new Error('The API returned invalid task data.')
  }
  return tasks
}
