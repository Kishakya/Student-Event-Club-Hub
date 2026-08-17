import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import AnnouncementForm from './features/announcements/AnnouncementForm.jsx'
import NoticeBoard from './features/announcements/NoticeBoard.jsx'
import ClubDirectory from './features/clubs/ClubDirectory.jsx'
import ClubForm from './features/clubs/ClubForm.jsx'
import EventForm from './features/events/EventForm.jsx'
import EventsFeed from './features/events/EventsFeed.jsx'
import RsvpForm from './features/rsvps/RsvpForm.jsx'
import RsvpsDashboard from './features/rsvps/RsvpsDashboard.jsx'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<EventsFeed />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/:id/edit" element={<EventForm />} />
          <Route path="/rsvps" element={<RsvpsDashboard />} />
          <Route path="/rsvps/new" element={<RsvpForm />} />
          <Route path="/rsvps/:id/edit" element={<RsvpForm />} />
          <Route path="/announcements" element={<NoticeBoard />} />
          <Route path="/announcements/new" element={<AnnouncementForm />} />
          <Route path="/announcements/:id/edit" element={<AnnouncementForm />} />
          <Route path="/clubs" element={<ClubDirectory />} />
          <Route path="/clubs/new" element={<ClubForm />} />
          <Route path="/clubs/:id/edit" element={<ClubForm />} />
        </Routes>
      </main>
    </>
  )
}

export default App
