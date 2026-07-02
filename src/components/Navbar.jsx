import { useState, useEffect } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

// const navLinks = [
//   { href: '#services', label: 'Services' },
//   { href: '#about', label: 'About' },
//   { href: '#process', label: 'Process' },
//   { href: '#contact', label: 'Contact' },
//   { href: '/gallery', label: 'Gallery' },
//   { href: '/gallery', label: 'Utility Hub ⭐' },
// ]
const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
  { href: '/gallery', label: 'Gallery' },

  {
    label: 'Utility Hub',
    children: [
      { href: '/estimate', label: 'Estimate' },
      { href: '/cvmaker', label: 'CV Maker' },
      { href: '/games', label: 'Games' },
      { href: '/tools', label: 'More Tools' },
    ],
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#" className="navbar__logo" onClick={closeMenu}>
          
          <span className="navbar__logo-icon">
  <img
    src="/logo.png"
    alt="Elite Nesting Logo"
    className="navbar__logo-image"
  />
</span>
          {/* <span className="navbar__logo-text">
            elite<em>Nesting</em>.com
          </span> */}
        </a>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <ul className="navbar__links">
  {navLinks.map((link) => (
    <li
      key={link.label}
      className={link.children ? 'dropdown' : ''}
    >
      {link.children ? (
        <>
          <button className="dropdown-btn" type="button">
  {link.label}
  <span className="dropdown-arrow">▼</span>
</button>

          <ul className="dropdown-menu">
            {link.children.map((item) => (
              <li key={item.href}>
                <Link to={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : link.label === 'Gallery' ? (
        <Link to="/gallery" onClick={closeMenu}>
          {link.label}
        </Link>
      ) : (
        <a href={link.href} onClick={closeMenu}>
          {link.label}
        </a>
      )}
    </li>
  ))}
</ul>
          <a href="#contact" className="navbar__cta" onClick={closeMenu}>
            Get a Quote
          </a>
        </nav>

        <button
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
