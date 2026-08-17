import { NavLink } from 'react-router-dom'
import './NavBar.css'

const links = [
  { to: '/clubs', label: 'Clubs' },
  { to: '/', label: 'Events', end: true },
  { to: '/rsvps', label: 'RSVPs' },
  { to: '/announcements', label: 'Noticeboard' },
]

function NavBar() {
  return (
    <header className="app-nav glass-panel">
      <NavLink to="/clubs" className="app-nav-brand">
        <span className="app-nav-mark">CH</span>
        Campus Club Hub
      </NavLink>
      <nav className="app-nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default NavBar
