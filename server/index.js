import { createApp } from './app.js'
import { openTaskStore, defaultDatabasePath } from './database.js'

const store = openTaskStore()
const app = createApp(store)
const server = app.listen(3001, '127.0.0.1', () => {
  console.log('JamTrack API: http://127.0.0.1:3001/api/tasks')
  console.log(`SQLite database: ${defaultDatabasePath}`)
})

let closing = false
function shutdown() {
  if (closing) return
  closing = true
  server.close(() => {
    store.close()
    process.exit(0)
  })
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
