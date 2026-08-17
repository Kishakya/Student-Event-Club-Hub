import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEvent, getEvent, updateEvent } from './eventsApi'
import './events.css'

const emptyForm = {
  title: '',
  description: '',
  dateTime: '',
  location: '',
  clubId: '',
}

function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function EventForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    getEvent(id)
      .then((event) =>
        setForm({
          title: event.title,
          description: event.description ?? '',
          dateTime: toDateTimeLocal(event.dateTime),
          location: event.location,
          clubId: event.clubId ?? '',
        }),
      )
      .catch(() => setError('Could not load this event.'))
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
    try {
      if (isEditing) {
        await updateEvent(id, { id: Number(id), ...form })
      } else {
        await createEvent(form)
      }
      navigate('/')
    } catch {
      setError('Could not save this event. Check the fields and try again.')
      setSaving(false)
    }
  }

  if (loading) return <p className="status-text">Loading…</p>

  return (
    <section id="event-form">
      <div className="page-header glass-panel">
        <h1>{isEditing ? 'Edit Event' : 'Post a New Event'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="glass-form glass-panel">
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={200}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            maxLength={2000}
          />
        </label>

        <div className="form-row">
          <label>
            Date &amp; Time
            <input
              type="datetime-local"
              name="dateTime"
              value={form.dateTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </label>
        </div>

        <label>
          Club ID
          <input
            name="clubId"
            value={form.clubId}
            onChange={handleChange}
            maxLength={50}
            placeholder="e.g. CS101"
          />
        </label>

        {error && <p className="status-text status-error">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Post Event'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default EventForm
