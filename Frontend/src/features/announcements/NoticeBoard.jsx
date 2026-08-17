import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAnnouncement, getAnnouncements } from './announcementsApi'
import './announcements.css'

function formatPostDate(postDate) {
  return new Date(postDate).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function NoticeBoard() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAnnouncements()
      .then((data) => {
        setAnnouncements(data)
        setError(null)
      })
      .catch(() => setError('Could not load announcements. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Remove "${title}"? This cannot be undone.`)) return
    await deleteAnnouncement(id)
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <section id="notice-board">
      <div className="page-header glass-panel">
        <div>
          <h1>Campus Noticeboard</h1>
          <p>Announcements and alerts from clubs and campus staff.</p>
        </div>
        <div className="page-header-actions">
          <Link className="btn-primary" to="/announcements/new">
            + New Announcement
          </Link>
        </div>
      </div>

      {loading && <p className="status-text">Loading announcements…</p>}
      {error && <p className="status-text status-error">{error}</p>}
      {!loading && !error && announcements.length === 0 && (
        <p className="status-text">No announcements yet. Post the first one.</p>
      )}

      <div className="notice-grid">
        {announcements.map((announcement) => (
          <article
            className={`notice-card glass-panel notice-priority-${announcement.priorityLevel.toLowerCase()}`}
            key={announcement.id}
          >
            <div className="notice-card-header">
              <span className="notice-priority-badge">{announcement.priorityLevel}</span>
              <span className="notice-date">{formatPostDate(announcement.postDate)}</span>
            </div>
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <div className="notice-actions">
              <Link to={`/announcements/${announcement.id}/edit`}>Edit</Link>
              <button
                type="button"
                className="link-danger"
                onClick={() => handleDelete(announcement.id, announcement.title)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default NoticeBoard
