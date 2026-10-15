import express from 'express'
import tasks from './data/tasks.json' with { type: 'json' }

const app = express()

app.get('/api/tasks', (_request, response) => {
  response.json(tasks)
})

export default app
