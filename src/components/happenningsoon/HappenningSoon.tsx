import { useState } from "react";
import "./HappenningSoon.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function HappenningSoon({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  return (
    <section className="section">
      {/* Happening Soon */}
      <div className="container">
        <div className="section-header">
          <h2>{t.happeningSoonTitle}</h2>
          <p>{t.announcementsSubTitle}</p>
        </div>
        <div className="happening-grid">
          {t.upcomingEvents.map((event, i) => (
            <article key={event.title} className="happening-card">
              {event.date && (
                <div className="happening-date vertical-text">{event.date}</div>
              )}
              <div className="happening-body">
                {event.thumbstone && (
                  <button
                    type="button"
                    className="happening-thumb-btn"
                    onClick={() => setZoomSrc(event.thumbstone)}
                    aria-label={event.title}
                  >
                    <img
                      className="happening-thumb"
                      src={event.thumbstone}
                      alt={event.title}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </button>
                )}
                <div className="happening-text">
                  {i === 0 && (
                    <span className="happening-badge">{t.nextUpLabel}</span>
                  )}
                  <h3>{event.title}</h3>
                  <p>{event.body}</p>
                  {event.url && (
                    <a
                      className="btn btn-gold happening-btn"
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.reserveSpot}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {zoomSrc && (
        <div
          className="happening-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomSrc(null)}
        >
          <img className="happening-lightbox-img" src={zoomSrc} alt="" />
        </div>
      )}
    </section>
  );
}
