import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
} from './announcementsApi'
import './announcements.css'

const emptyForm = {
  title: '',
  content: '',
  priorityLevel: 'Normal',
}

function AnnouncementForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    getAnnouncement(id)
      .then((announcement) =>
        setForm({
          title: announcement.title,
          content: announcement.content,
          priorityLevel: announcement.priorityLevel,
        }),
      )
      .catch(() => setError('Could not load this announcement.'))
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
        await updateAnnouncement(id, {
          id: Number(id),
          postDate: new Date().toISOString(),
          ...form,
        })
      } else {
        await createAnnouncement(form)
      }
      navigate('/announcements')
    } catch {
      setError('Could not save this announcement. Check the fields and try again.')
      setSaving(false)
    }
  }

  if (loading) return <p className="status-text">Loading…</p>

  return (
    <section id="announcement-form">
      <div className="page-header glass-panel">
        <h1>{isEditing ? 'Edit Announcement' : 'Post a New Announcement'}</h1>
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
          Content
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={5}
            maxLength={2000}
          />
        </label>

        <label>
          Priority
          <select name="priorityLevel" value={form.priorityLevel} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
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
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Post Announcement'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AnnouncementForm
