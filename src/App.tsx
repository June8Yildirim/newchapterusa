import "./App.css";
import {
  credentials,
  LOREM,
  LOREM_SHORT,
  pillars,
  publications,
} from "./constants/text";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { Stars } from "./Stars";

const CONTACT_EMAIL = "hello@newchapter.example";

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);

  const name = String(data.get("name") ?? "");
  const email = String(data.get("email") ?? "");
  const stage = String(data.get("stage") ?? "");
  const barrier = String(data.get("barrier") ?? "");
  const support = String(data.get("support") ?? "");
  const consent = data.get("consent") ? "Yes" : "No";

  const subject = `New Chapter application${name ? ` — ${name}` : ""}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Current Professional Transition Stage: ${stage}`,
    `Top Career Barrier: ${barrier}`,
    `Requested Support Type: ${support}`,
    `Consent to be contacted: ${consent}`,
  ].join("\n");

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

function App() {
  return (
    <div className="page">
      {/* Header */}
      <header className="site-header">
        <div className="container header-inner">
          <div>
            <button
              className="btn btn-blue"
              type="button"
              style={{ background: "transparent" }}
            >
              Logo
            </button>
            <span className="brand">New Chapter</span>
          </div>

          <nav className="header-nav">
            <button className="btn btn-blue" type="button">
              Apply for the 6-Week Free Cohort
            </button>
            <button className="btn btn-gold" type="button">
              Explore the 6 Pillars
            </button>
            <button className="btn btn-blue " type="button">
              EN
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-sub">Write Your Next Chapter</h1>
          <div className="hero-actions"></div>
        </div>
      </section>

      {/* Meet Your Coach */}
      <section className="section coach">
        <div className="container coach-inner">
          <div className="coach-text">
            <p className="hero-sub">{LOREM_SHORT}</p>
            <p className="hero-sub">{LOREM}</p>
            <p className="hero-sub">{LOREM}</p>
            <h2>Meet Your Coach: Dr. Mehtap Akay</h2>
            <p className="muted small">{LOREM_SHORT}</p>
            <ul className="credentials">
              {credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <PhotoPlaceholder />
        </div>
      </section>

      {/* Publications */}
      <section className="section publications">
        <div className="container">
          <h2>Selected Publications &amp; Resources</h2>
          <div className="pub-grid">
            {publications.map((title) => (
              <article key={title} className="pub-card">
                <div className="pub-image" />
                <h3>{title}</h3>
                <div className="bar bar-lg" />
                <div className="bar bar-sm" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="section pillars">
        <div className="container">
          <h2>The 6 Pillars of Growth</h2>
          <p className="muted small">{LOREM_SHORT}</p>
          <div className="pillar-grid">
            {pillars.map((title) => (
              <article key={title} className="pillar-card">
                <h3>{title}</h3>
                <p>Supporting description for this card.</p>
                <button className="btn btn-gold btn-block" type="button">
                  Watch Sample Webinar
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <h2>The Pilot Blueprint: 6-Week Group Coaching</h2>
          <p className="muted small">{LOREM_SHORT}</p>
          <div className="testimonial-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="testimonial-card">
                <Stars />
                <p className="quote">“{LOREM}”</p>
                <div className="person">
                  <span className="avatar" />
                  <div className="person-meta">
                    <strong>Jane Doe</strong>
                    <span className="role">Product Manager</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA form */}
      <section className="section update">
        <div className="container">
          <h2 className="center">Get To Know Latest Update</h2>
          <form className="update-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="text"
              name="stage"
              placeholder="Current Professional Transition Stage"
            />
            <input type="text" name="barrier" placeholder="Top Career Barrier" />
            <input
              type="text"
              name="support"
              placeholder="Requested Support Type"
            />
            <label className="checkbox-row">
              <input type="checkbox" name="consent" />
              <span>{LOREM_SHORT}</span>
            </label>
            <button className="btn btn-gold btn-block" type="submit">
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
