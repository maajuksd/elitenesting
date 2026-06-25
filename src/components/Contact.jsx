import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: '', email: '', phone: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="contact">
      <div className="container contact__inner">
        <div className="contact__info">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Let&apos;s build something together</h2>
          <p className="contact__text">
            Ready to start your project? Reach out for a free consultation.
            We&apos;ll discuss your vision, timeline, and how Elite Nesting can help.
          </p>

          <div className="contact__details">
            <div className="contact__detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span className="contact__detail-label">Phone</span>
                <a href="tel:+91 9037216707">+91 9037216707</a>
              </div>
            </div>
            <div className="contact__detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span className="contact__detail-label">Email</span>
                <a href="mailto:info@elitenesting.com">info@elitenesting.com</a>
              </div>
            </div>
            <div className="contact__detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span className="contact__detail-label">Office</span>
                <span>Kasaragod, Kerala</span>
              </div>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          {submitted && (
            <div className="contact__success" role="alert">
              Thank you! We&apos;ll be in touch shortly.
            </div>
          )}
          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your Full Name"
              />
            </div>
            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="contact__field">
              <label htmlFor="service">Service</label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>
                <option value="interior-design">Interior Design</option>
                <option value="contracting">Contracting</option>
                <option value="building-permit">Building Permit</option>
                <option value="building-numbering">Building Numbering</option>
                <option value="site-supervision">Site Supervision</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="contact__field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Tell us about your project..."
            />
          </div>
          <button type="submit" className="btn btn--primary contact__submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}
