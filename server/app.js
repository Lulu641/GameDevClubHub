import express from 'express'

function taskInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Send a task as a JSON object.' }
  }
  const { title, description = '', effortPoints = 1 } = body
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) {
    return { error: 'Enter a task title between 1 and 100 characters.' }
  }
  if (typeof description !== 'string' || description.trim().length > 500) {
    return { error: 'Description must be text of up to 500 characters.' }
  }
  if (!Number.isInteger(effortPoints) || effortPoints < 1 || effortPoints > 100) {
    return { error: 'Effort points must be a whole number from 1 to 100.' }
  }
  return { task: { title: title.trim(), description: description.trim(), effortPoints } }
}

function validId(value) {
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))
}

export function createApp(store) {
  const app = express()
  app.use(express.json({ limit: '16kb' }))
  app.use('/api', (_request, response, next) => {
    response.set('Cache-Control', 'no-store')
    next()
  })

  app.get('/api/tasks', (_request, response) => {
    response.json(store.list())
  })

  app.post('/api/tasks', (request, response) => {
    const input = taskInput(request.body)
    if (input.error) return response.status(400).json({ error: input.error })
    const saved = store.create(input.task)
    response.status(201).json(saved)
  })

  app.patch('/api/tasks/:id/complete', (request, response) => {
    if (!validId(request.params.id)) return response.status(400).json({ error: 'Invalid task ID.' })
    if (typeof request.body?.completed !== 'boolean') {
      return response.status(400).json({ error: 'Send completed as true or false.' })
    }
    const saved = store.setCompleted(Number(request.params.id), request.body.completed)
    if (!saved) return response.status(404).json({ error: 'Task not found.' })
    response.json(saved)
  })

  // Preserve the existing Remove button, with deletion now stored in SQLite.
  app.delete('/api/tasks/:id', (request, response) => {
    if (!validId(request.params.id)) return response.status(400).json({ error: 'Invalid task ID.' })
    if (!store.remove(Number(request.params.id))) {
      return response.status(404).json({ error: 'Task not found.' })
    }
    response.status(204).end()
  })

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found.' })
  })

  app.use((error, _request, response, _next) => {
    if (error.type === 'entity.parse.failed') {
      return response.status(400).json({ error: 'Request body must be valid JSON.' })
    }
    if (error.type === 'entity.too.large') {
      return response.status(413).json({ error: 'Request body is too large.' })
    }
    response.status(500).json({ error: 'Could not access the task database. Please try again.' })
  })
  return app
}
