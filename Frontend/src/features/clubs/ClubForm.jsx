import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createClub, getClub, updateClub } from './clubsApi'
import './clubs.css'

const emptyForm = {
  name: '',
  category: '',
  description: '',
  presidentName: '',
  contactEmail: '',
  isActive: true,
}

function ClubForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    getClub(id)
      .then((club) =>
        setForm({
          name: club.name,
          category: club.category,
          description: club.description ?? '',
          presidentName: club.presidentName,
          contactEmail: club.contactEmail,
          isActive: club.isActive,
        }),
      )
      .catch(() => setError('Could not load this club.'))
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
        await updateClub(id, { id: Number(id), ...form })
      } else {
        await createClub(form)
      }
      navigate('/clubs')
    } catch {
      setError('Could not save this club. Check the fields and try again.')
      setSaving(false)
    }
  }

  if (loading) return <p className="status-text">Loading…</p>

  return (
    <section id="club-form">
      <div className="page-header glass-panel">
        <h1>{isEditing ? 'Edit Club' : 'Register a New Club'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-form glass-panel">
        <label>
          Club Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={200}
            placeholder="e.g. Robotics Society"
          />
        </label>

        <div className="form-row">
          <label>
            Category
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="e.g. Technology"
            />
          </label>

          <label>
            President Name
            <input
              name="presidentName"
              value={form.presidentName}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </label>
        </div>

        <label>
          Contact Email
          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            required
            maxLength={200}
            placeholder="club@campus.edu"
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
            placeholder="What does this club do?"
          />
        </label>

        {isEditing && (
          <label className="club-active-toggle">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            Club is active
          </label>
        )}

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
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Register Club'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ClubForm
