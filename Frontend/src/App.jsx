import { Route, Routes } from 'react-router-dom'
import EventForm from './features/events/EventForm.jsx'
import EventsFeed from './features/events/EventsFeed.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsFeed />} />
      <Route path="/events/new" element={<EventForm />} />
      <Route path="/events/:id/edit" element={<EventForm />} />
    </Routes>
  )
}

export default App
