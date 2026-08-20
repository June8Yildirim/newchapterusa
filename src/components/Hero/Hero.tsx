import "./Hero.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export const Hero = ({
  lang,
  onNewsletter,
  onWaitlist,
  onContact,
}: {
  lang: Language;
  onNewsletter: () => void;
  onWaitlist: () => void;
  onContact: () => void;
}) => {
  const t = TRANSLATIONS[lang];
  const s = t.hero.summary;
  const n = t.network;

  return (
    <>
      <section id="meetcoach" className="hero nav-anchor"></section>

      <section className="section">
        <section className="container">
          <div className="network-actions">
            <Button variant="gold" onClick={onNewsletter}>
              {n.newsletterBtn}
            </Button>
            <Button variant="blue" onClick={onWaitlist}>
              {n.waitlistBtn}
            </Button>
            <Button variant="gold" onClick={onContact}>
              {t.navFooter.contactTitle}
            </Button>
          </div>
          <h3 className="hero-build-subtitle">{s.heroImage}</h3>
        </section>

        <section className="container hero-content">
          <div className="hero-intro">
            <img
              className="hero-photo"
              src="/images/Mehtap.jpeg"
              alt={s.title}
              width={150}
              height={150}
            />
            <div className="hero-intro-text">
              <h1 className="hero-title">{s.title}</h1>
              <p className="hero-position">{s.position}</p>
            </div>
          </div>

          <blockquote className="hero-quote">{s.quote}</blockquote>

          <div className="hero-bio">
            <p>{s.bio1}</p>
            <p>{s.bio2}</p>
          </div>

          <div className="hero-build">
            <h2 className="hero-build-title">{s.buildTitle}</h2>
            <ul className="hero-builds">
              {s.builds.map((b) => (
                <li key={b.title}>
                  <strong>{b.title}:</strong> {b.detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-actions">
            <Button
              variant="blue"
              className="hero-cta"
              onClick={() => {
                window.open(
                  "https://calendar.app.google/1r6MpUrGYqG3ViSR7",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              {s.appointmentBtn}
            </Button>
            <a
              className="btn btn-gold hero-cta"
              href={s.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.linkedinBtn} →
            </a>
          </div>
        </section>
      </section>
    </>
  );
};
