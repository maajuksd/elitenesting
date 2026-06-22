import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#" className="footer__logo">
            Elite <em>Nesting</em>
          </a>
          <p className="footer__tagline">
            Crafting exceptional interiors with precision and care.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Interior Design</a></li>
              <li><a href="#services">Contracting</a></li>
              <li><a href="#services">Building Permit</a></li>
              <li><a href="#services">Site Supervision</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#process">Our Process</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {year} Elite Nesting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
