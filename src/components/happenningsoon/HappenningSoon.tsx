import { useEffect, useRef, useState } from "react";
import "./HappenningSoon.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function HappenningSoon({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 2
  );

  const events = t.upcomingEvents || [];
  const total = events.length;
  const maxIndex = Math.max(0, total - visibleCount);
  const currentIndex = Math.min(index, maxIndex);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth <= 768 ? 1 : 2);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goTo = (i: number) => {
    setIndex(Math.min(Math.max(i, 0), maxIndex));
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Auto-advance every 5s, looping back to start; paused on hover.
  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, maxIndex]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
  };

  return (
    <section id="events" className="section happening-section nav-anchor">
      {/* Happening Soon */}
      <div className="container">
        <div className="section-header">
          <h2>{t.happeningSoonTitle}</h2>
          <p>{t.announcementsSubTitle}</p>
        </div>

        <div
          className="happening-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            className="carousel-arrow prev"
            onClick={prev}
            disabled={currentIndex === 0}
            aria-label="Previous event"
          >
            ‹
          </button>

          <div
            className="happening-viewport"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="happening-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {events.map((event, i) => (
                <article key={event.title + i} className="happening-card">
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

          <button
            type="button"
            className="carousel-arrow next"
            onClick={next}
            disabled={currentIndex === maxIndex}
            aria-label="Next event"
          >
            ›
          </button>
        </div>

        <div className="happening-dots" role="tablist">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to slide ${i + 1}`}
              className={`dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
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
