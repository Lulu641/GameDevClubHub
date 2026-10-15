import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const children = [
  spawn(process.execPath, ['--watch', 'server/index.js'], { cwd: root, stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0'], {
    cwd: fileURLToPath(new URL('../client/', import.meta.url)),
    stdio: 'inherit',
  }),
]

let stopping = false
function stop() {
  if (stopping) return
  stopping = true
  children.forEach((child) => child.kill('SIGTERM'))
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error.message)
    process.exitCode = 1
    stop()
  })
  child.on('exit', (code) => {
    if (!stopping) {
      process.exitCode = code ?? 1
      stop()
    }
  })
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
