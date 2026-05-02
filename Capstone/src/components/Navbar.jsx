import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Navbar.css'

function Navbar() {
  const currentLocation = useLocation()
  const currentPath = currentLocation.pathname
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const links = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/saved', label: 'Saved Items' },
    { path: '/trends', label: 'Price Trends' },
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        GroceryCompare
      </Link>

      <ul className="navbar-links">
        {links.map((item) => {
          const isActive = currentPath === item.path
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <button
        className="dark-mode-btn"
        onClick={() => setDarkMode(prev => !prev)}
        title="Toggle dark mode"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </nav>
  )
}

export default Navbar