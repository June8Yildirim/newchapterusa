import "./Publications.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function Publications({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];

  return (
    <section id="research" className="section publications nav-anchor">
      {/* Publications */}
      <div className="container">
        <div className="section-header">
          <h2>{t.research.publicationsTitle}</h2>
          <p className="description">{t.research.publicationsSubTitle}</p>
        </div>
        <div className="pub-grid">
          {t.research.publicationsRich.map((pub) => (
            <article key={pub.title} className="pub-card">
              <h3 className="pub-title">{pub.title}</h3>
              <p className="pub-citation">
                {pub.citationUrl ? (
                  <a
                    className="pub-citation-link"
                    href={pub.citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pub.citation}
                  </a>
                ) : (
                  pub.citation
                )}
                {pub.citationSuffix}
              </p>
              <p className="pub-desc">{pub.description}</p>
              <a
                className="btn btn-transparent btn-block pub-link"
                href={pub.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="btn-label">{pub.linkText}</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
