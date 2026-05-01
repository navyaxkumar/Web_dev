import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const currentLocation = useLocation()
  const currentPath = currentLocation.pathname

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

    </nav>
  )
}

export default Navbar
