import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../events/eventsApi'
import { deleteRsvp, getRsvps, updateRsvpStatus } from './rsvpsApi'
import './rsvps.css'

const STATUS_OPTIONS = ['Attending', 'Waitlisted', 'Cancelled']

function RsvpsDashboard() {
  const [rsvps, setRsvps] = useState([])
  const [events, setEvents] = useState([])
  const [eventFilter, setEventFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEvents().then(setEvents).catch(() => {})
  }, [])

  useEffect(() => {
    getRsvps(eventFilter || undefined)
      .then((data) => {
        setRsvps(data)
        setError(null)
      })
      .catch(() => setError('Could not load RSVPs. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [eventFilter])

  const handleFilterChange = (e) => {
    setLoading(true)
    setEventFilter(e.target.value)
  }

  const eventsById = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, e])),
    [events],
  )

  const handleStatusChange = async (rsvp, status) => {
    const previous = rsvp.status
    setRsvps((prev) =>
      prev.map((r) => (r.id === rsvp.id ? { ...r, status } : r)),
    )
    try {
      await updateRsvpStatus(rsvp.id, status)
    } catch {
      setRsvps((prev) =>
        prev.map((r) => (r.id === rsvp.id ? { ...r, status: previous } : r)),
      )
      setError('Could not update status. Please try again.')
    }
  }

  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`Cancel the RSVP for "${studentName}"? This cannot be undone.`))
      return
    await deleteRsvp(id)
    setRsvps((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <section id="rsvps-dashboard">
      <div className="page-header glass-panel">
        <div>
          <h1>Student RSVPs</h1>
          <p>Track who&apos;s attending, waitlisted, or cancelled.</p>
        </div>
        <div className="page-header-actions">
          <Link className="btn-primary" to="/rsvps/new">
            + New RSVP
          </Link>
        </div>
      </div>

      <div className="rsvps-filter glass-panel">
        <label>
          Filter by event
          <select value={eventFilter} onChange={handleFilterChange}>
            <option value="">All events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="status-text">Loading RSVPs…</p>}
      {error && <p className="status-text status-error">{error}</p>}
      {!loading && !error && rsvps.length === 0 && (
        <p className="status-text">No RSVPs yet.</p>
      )}

      {!loading && !error && rsvps.length > 0 && (
        <table className="rsvps-table glass-panel">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Event</th>
              <th>Dietary Notes</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td>{rsvp.studentName}</td>
                <td>{rsvp.studentIdNumber}</td>
                <td>{eventsById[rsvp.eventId]?.title ?? `Event #${rsvp.eventId}`}</td>
                <td>{rsvp.dietaryNotes || '—'}</td>
                <td>
                  <select
                    className={`status-select status-${rsvp.status.toLowerCase()}`}
                    value={rsvp.status}
                    onChange={(e) => handleStatusChange(rsvp, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="rsvps-row-actions">
                  <Link to={`/rsvps/${rsvp.id}/edit`}>Edit</Link>
                  <button
                    type="button"
                    className="link-danger"
                    onClick={() => handleDelete(rsvp.id, rsvp.studentName)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default RsvpsDashboard
