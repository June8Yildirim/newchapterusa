import "./PreFooterCallout.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function PreFooterCallout({ lang }: { lang: Language }) {
  const c = TRANSLATIONS[lang].navFooter.preFooter;

  return (
    <section className="prefooter">
      <div className="container">
        <div className="prefooter-card">
          <div className="prefooter-text">
            <h3 className="prefooter-title">{c.title}</h3>
            <p className="prefooter-body">{c.body}</p>
          </div>
          <a
            className="btn btn-gold prefooter-btn"
            href="https://www.newchapterusa.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.btn} →
          </a>
        </div>
      </div>
    </section>
  );
}
