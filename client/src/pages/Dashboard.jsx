import { Link } from 'react-router'
import TaskSummary from '../components/TaskSummary.jsx'

function Dashboard({ tasks }) {
  return (
    <>
      <header>
        <p className="eyebrow">Game Development Club</p>
        <h1>Dashboard</h1>
        <p>Here's where our club's game development work stands.</p>
      </header>
      <TaskSummary tasks={tasks} />
      <p className="dashboard-link"><Link to="/tasks">Manage club tasks</Link></p>
      <p className="note">Your changes stay while you switch pages. Refreshing restores the API's sample tasks.</p>
    </>
  )
}

export default Dashboard
