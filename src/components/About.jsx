import { stats } from '../data/services'
import './About.css'

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container about__inner">
        <div className="about__content">
          <span className="section-label">About Us</span>
          <h2 className="section-title">
            Building spaces that feel like home
          </h2>
          <p className="about__text">
            Elite Nesting was founded on a simple belief: every space deserves
            thoughtful design and flawless execution. With over a decade of
            experience, we&apos;ve helped homeowners and businesses transform
            properties across residential, commercial, and hospitality sectors.
          </p>
          <p className="about__text">
            Our integrated approach means you work with one trusted team from
            permit applications to final furnishings — no gaps, no surprises,
            just exceptional results.
          </p>
          <ul className="about__features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Licensed &amp; insured professionals
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Transparent pricing &amp; timelines
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dedicated project managers
            </li>
          </ul>
        </div>

        <div className="about__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="about__stat">
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
