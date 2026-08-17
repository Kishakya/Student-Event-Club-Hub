import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteEvent, getEvents } from './eventsApi'
import './events.css'

function formatDay(dateTime) {
  return new Date(dateTime).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateTime) {
  return new Date(dateTime).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function groupByDay(events) {
  const groups = []
  let currentDay = null
  let currentGroup = null

  for (const event of events) {
    const day = formatDay(event.dateTime)
    if (day !== currentDay) {
      currentDay = day
      currentGroup = { day, events: [] }
      groups.push(currentGroup)
    }
    currentGroup.events.push(event)
  }

  return groups
}

function EventsFeed() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvents(data)
        setError(null)
      })
      .catch(() => setError('Could not load events. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Cancel "${title}"? This cannot be undone.`)) return
    await deleteEvent(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const groups = groupByDay(events)
  const now = new Date()

  return (
    <section id="events-feed">
      <div className="events-feed-header">
        <h1>Upcoming Events</h1>
        <div className="events-feed-header-actions">
          <Link to="/rsvps">RSVPs Dashboard</Link>
          <Link className="btn-primary" to="/events/new">
            + New Event
          </Link>
        </div>
      </div>

      {loading && <p className="events-status">Loading events…</p>}
      {error && <p className="events-status events-error">{error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="events-status">No events yet. Be the first to post one.</p>
      )}

      {groups.map((group) => (
        <div className="event-day-group" key={group.day}>
          <h2 className="event-day-heading">{group.day}</h2>
          <ul className="event-list">
            {group.events.map((event) => {
              const isPast = new Date(event.dateTime) < now
              return (
                <li
                  className={`event-card${isPast ? ' event-past' : ''}`}
                  key={event.id}
                >
                  <div className="event-time">{formatTime(event.dateTime)}</div>
                  <div className="event-body">
                    <h3>{event.title}</h3>
                    {event.description && <p>{event.description}</p>}
                    <div className="event-meta">
                      <span>📍 {event.location}</span>
                      {event.clubId && <span>🏷 {event.clubId}</span>}
                    </div>
                  </div>
                  <div className="event-actions">
                    <Link to={`/events/${event.id}/edit`}>Edit</Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id, event.title)}
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}

export default EventsFeed
