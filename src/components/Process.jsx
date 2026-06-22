import { process } from '../data/services'
import './Process.css'

export default function Process() {
  return (
    <section id="process" className="process">
      <div className="container">
        <div className="process__header">
          <span className="section-label">How We Work</span>
          <h2 className="section-title">Our Process</h2>
          <p className="section-subtitle">
            A clear, structured approach that keeps your project on track from
            first meeting to final handover.
          </p>
        </div>

        <div className="process__steps">
          {process.map((item, index) => (
            <div key={item.step} className="process__step">
              <div className="process__step-number">{item.step}</div>
              {index < process.length - 1 && (
                <div className="process__connector" aria-hidden="true" />
              )}
              <h3 className="process__step-title">{item.title}</h3>
              <p className="process__step-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
