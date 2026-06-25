import { useState, useEffect } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
  { href: '/gallery', label: 'Gallery' },
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
              <li key={link.href}>
                {/* <a href={link.href} onClick={closeMenu}>{link.label}</a> */}
                {link.label === 'Gallery' ? (
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
