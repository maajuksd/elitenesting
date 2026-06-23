import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__bg-pattern" aria-hidden="true" />
        <div className="hero__bg-gradient" aria-hidden="true" />
      </div>

      <div className="container hero__content">
        <div className="hero__text">
          <span className="section-label">Interior Design & Contracting test</span>
          <h1 className="hero__title">
            Spaces crafted with
            <span className="hero__title-accent"> precision</span> and care
          </h1>
          <p className="hero__description">
            Elite Nesting delivers end-to-end interior solutions — from design
            and permits to contracting and site supervision. We turn your vision
            into a finished space you&apos;ll love.
          </p>
          <div className="hero__actions">
            <a href="#contact" className="btn btn--primary">Start Your Project</a>
            <a href="#services" className="btn btn--outline">Explore Services</a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__image-frame">
            <div className="hero__image-placeholder">
              <div className="hero__room">
                <div className="hero__room-wall" />
                <div className="hero__room-floor" />
                <div className="hero__room-sofa" />
                <div className="hero__room-table" />
                <div className="hero__room-lamp" />
                <div className="hero__room-plant" />
              </div>
            </div>
            <div className="hero__badge">
              <span className="hero__badge-number">12+</span>
              <span className="hero__badge-text">Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
