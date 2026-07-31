import "../../App.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export const Hero = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const s = t.summary;

  return (
    <>
      <section className="hero"></section>
      <section className="container hero-content">
        <h1 className="hero-title">{s.title}</h1>
        <p className="hero-position">{s.position}</p>

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
    </>
  );
};
