function validTask(task) {
  return task && Number.isSafeInteger(task.id) && task.id > 0 &&
    typeof task.title === 'string' && task.title.trim() &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    task.status === (task.completed ? 'Completed' : 'Not started') &&
    Number.isInteger(task.effortPoints) && task.effortPoints >= 1 && task.effortPoints <= 100
}

async function request(path, options = {}) {
  const response = await fetch(path, { cache: 'no-store', ...options })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Task request failed (${response.status}).`)
  }
  return response.status === 204 ? null : response.json()
}

function savedTask(data) {
  if (!validTask(data)) throw new Error('The API returned invalid task data.')
  return data
}

export async function fetchTasks(signal) {
  const tasks = await request('/api/tasks', { signal })
  if (!Array.isArray(tasks) || tasks.some((task) => !validTask(task)) ||
      new Set(tasks.map((task) => task.id)).size !== tasks.length) {
    throw new Error('The API returned invalid task data.')
  }
  return tasks
}

export async function createTask(task) {
  return savedTask(await request('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  }))
}

export async function setTaskCompletion(id, completed) {
  return savedTask(await request(`/api/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  }))
}

export async function deleteTask(id) {
  await request(`/api/tasks/${id}`, { method: 'DELETE' })
}
