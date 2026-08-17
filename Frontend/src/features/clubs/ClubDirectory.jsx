import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deactivateClub, getClubs } from './clubsApi'
import './clubs.css'

const BADGE_TONES = ['violet', 'teal', 'amber', 'rose', 'blue', 'green']

function badgeTone(category) {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) % BADGE_TONES.length
  }
  return BADGE_TONES[hash]
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

function ClubDirectory() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    getClubs()
      .then((data) => {
        setClubs(data)
        setError(null)
      })
      .catch(() => setError('Could not load clubs. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(clubs.map((c) => c.category))).sort(),
    [clubs],
  )

  const filteredClubs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return clubs.filter((club) => {
      const matchesCategory = !category || club.category === category
      const matchesQuery =
        !query ||
        club.name.toLowerCase().includes(query) ||
        club.presidentName.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [clubs, search, category])

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the directory.`))
      return
    await deactivateClub(id)
    setClubs((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <section id="club-directory">
      <div className="page-header glass-panel">
        <div>
          <h1>Club &amp; Society Directory</h1>
          <p>Discover and manage every active club on campus.</p>
        </div>
        <div className="page-header-actions">
          <Link className="btn-primary" to="/clubs/new">
            + Register a Club
          </Link>
        </div>
      </div>

      <div className="club-toolbar glass-panel">
        <input
          type="search"
          placeholder="Search by club or president name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="club-search"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="status-text">Loading clubs…</p>}
      {error && <p className="status-text status-error">{error}</p>}
      {!loading && !error && filteredClubs.length === 0 && (
        <p className="status-text">
          {clubs.length === 0
            ? 'No clubs yet. Be the first to register one.'
            : 'No clubs match your search.'}
        </p>
      )}

      <div className="club-grid">
        {filteredClubs.map((club) => (
          <article className="club-card glass-panel" key={club.id}>
            <div className="club-card-top">
              <div className="club-avatar">{initials(club.name)}</div>
              <span className={`club-badge club-badge-${badgeTone(club.category)}`}>
                {club.category}
              </span>
            </div>

            <h3>{club.name}</h3>
            {club.description && <p className="club-description">{club.description}</p>}

            <div className="club-meta">
              <div className="club-meta-row">
                <span className="club-meta-label">President</span>
                <span>{club.presidentName}</span>
              </div>
              <div className="club-meta-row">
                <span className="club-meta-label">Contact</span>
                <a href={`mailto:${club.contactEmail}`}>{club.contactEmail}</a>
              </div>
            </div>

            <div className="club-actions">
              <Link to={`/clubs/${club.id}/edit`}>Edit</Link>
              <button
                type="button"
                className="link-danger"
                onClick={() => handleDeactivate(club.id, club.name)}
              >
                Deactivate
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ClubDirectory
