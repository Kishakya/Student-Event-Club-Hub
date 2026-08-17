import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getEvents } from '../events/eventsApi'
import { createRsvp, getRsvp, updateRsvp } from './rsvpsApi'
import './rsvps.css'

const STATUS_OPTIONS = ['Attending', 'Waitlisted', 'Cancelled']

const emptyForm = {
  studentName: '',
  studentIdNumber: '',
  eventId: '',
  dietaryNotes: '',
  status: 'Attending',
}

function RsvpForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    ...emptyForm,
    eventId: searchParams.get('eventId') ?? '',
  })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setError('Could not load events.'))
  }, [])

  useEffect(() => {
    if (!isEditing) return
    getRsvp(id)
      .then((rsvp) =>
        setForm({
          studentName: rsvp.studentName,
          studentIdNumber: rsvp.studentIdNumber,
          eventId: String(rsvp.eventId),
          dietaryNotes: rsvp.dietaryNotes ?? '',
          status: rsvp.status,
        }),
      )
      .catch(() => setError('Could not load this RSVP.'))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, eventId: Number(form.eventId) }
    try {
      if (isEditing) {
        await updateRsvp(id, { id: Number(id), ...payload })
      } else {
        await createRsvp(payload)
      }
      navigate('/rsvps')
    } catch {
      setError('Could not save this RSVP. Check the fields and try again.')
      setSaving(false)
    }
  }

  if (loading) return <p className="rsvps-status">Loading…</p>

  return (
    <section id="rsvp-form">
      <h1>{isEditing ? 'Edit RSVP' : 'Register for an Event'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Event
          <select
            name="eventId"
            value={form.eventId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select an event
            </option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>

        <div className="form-row">
          <label>
            Student Name
            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </label>

          <label>
            Student ID Number
            <input
              name="studentIdNumber"
              value={form.studentIdNumber}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </label>
        </div>

        <label>
          Dietary Notes
          <textarea
            name="dietaryNotes"
            value={form.dietaryNotes}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Allergies, vegetarian, etc. (optional)"
          />
        </label>

        {isEditing && (
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && <p className="rsvps-status rsvps-error">{error}</p>}

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Submit RSVP'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default RsvpForm
