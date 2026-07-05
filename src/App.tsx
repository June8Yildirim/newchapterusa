import { useRef, useState } from "react";
import "./App.css";
import {
  credentials,
  LOREM,
  LOREM_SHORT,
  pillars,
  publications,
} from "./constants/text";
import { Modal } from "./Modal";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { Stars } from "./Stars";
import { SubmitApplication } from "./submitApp";
import { useSiteAnimations } from "./useSiteAnimations";

function App() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  useSiteAnimations(container);

  return (
    <div className="page" ref={container}>
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
          {/* <h1 className="hero-sub">Write Your Next Chapter</h1> */}
          {/* <div className="hero-actions"></div> */}
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
      <section className="section flexing">
        <h2 className="center">Get To Know Latest Update</h2>
        <button
          className="btn btn-gold"
          onClick={() => setConfirmOpen(!confirmOpen)}
        >
          Send Application
        </button>
      </section>
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="SubmitApplication"
      >
        <SubmitApplication
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
        />
      </Modal>
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Application received"
      >
        <p>
          Thanks for applying. Your email client should have opened with your
          details — just hit send and we'll be in touch soon.
        </p>
        <button
          type="button"
          className="btn btn-gold btn-block"
          onClick={() => setConfirmOpen(false)}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default App;
