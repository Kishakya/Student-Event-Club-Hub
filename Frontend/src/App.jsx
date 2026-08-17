import { Route, Routes } from 'react-router-dom'
import EventForm from './features/events/EventForm.jsx'
import EventsFeed from './features/events/EventsFeed.jsx'
import RsvpForm from './features/rsvps/RsvpForm.jsx'
import RsvpsDashboard from './features/rsvps/RsvpsDashboard.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsFeed />} />
      <Route path="/events/new" element={<EventForm />} />
      <Route path="/events/:id/edit" element={<EventForm />} />
      <Route path="/rsvps" element={<RsvpsDashboard />} />
      <Route path="/rsvps/new" element={<RsvpForm />} />
      <Route path="/rsvps/:id/edit" element={<RsvpForm />} />
    </Routes>
  )
}

export default App
