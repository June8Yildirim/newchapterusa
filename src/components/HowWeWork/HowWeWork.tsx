import "./HowWeWork.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function HowWeWork({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const h = t.howWeWork;

  return (
    <section className="section pillars">
      <div className="container">
        <h2>{h.title}</h2>

        <h3 className="hww-subheading">{h.serviceHeading}</h3>
        <div className="hww-grid">
          {h.services.map((s) => (
            <article key={s.title} className="hww-card">
              <h4>{s.title}</h4>
              <p>{s.detail}</p>
            </article>
          ))}
        </div>

        <h3 className="hww-subheading">{h.frameworkHeading}</h3>
        <p className="hww-intro">{h.frameworkIntro}</p>
        <div className="hww-grid">
          {h.frameworks.map((f) => (
            <article key={f.title} className="hww-card hww-card--framework">
              <h4>{f.title}</h4>
              <p>{f.detail}</p>
            </article>
          ))}
        </div>

        <blockquote className="hww-quote">{h.quote}</blockquote>
      </div>
    </section>
  );
}
