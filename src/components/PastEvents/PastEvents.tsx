import "./PastEvents.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

/** Small localized label for the green "status" pill on each past-event card. */
const STATUS_LABEL: Record<Language, string> = {
  en: "Online",
  tr: "Çevrimiçi",
};

/** Split a date label like "August 14, 2025" into a day part and a year part. */
function splitDate(date: string): { day: string; year: string } {
  const yearMatch = date.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : "";
  const day = year
    ? date
        .replace(year, "")
        .replace(/[,\s]+$/, "")
        .trim()
    : date;
  return { day, year };
}

/**
 * Archive of events that have already taken place. Reads the same
 * `events.upcomingEvents` list as HappenningSoon but shows only entries flagged
 * `isHappened: true`. Renders nothing when there are no past events yet.
 */
export default function PastEvents({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];

  const events = (t.events.upcomingEvents || []).filter((e) => e.isHappened);
  if (events.length === 0) return null;

  return (
    <section
      id="past-events"
      className="section past-events-section nav-anchor"
    >
      <div className="container">
        <div className="section-header">
          <h2>{t.pastEvents.pastEventsTitle}</h2>
          <p>{t.pastEvents.pastEventsSubTitle}</p>
        </div>

        <div className="past-events-grid">
          {events.map((event, i) => {
            const { day, year } = splitDate(event.date);
            return (
              <article key={event.title + i} className="past-event-card">
                <div className="past-event-datebox">
                  <span className="past-event-top-curve" aria-hidden="true" />
                  <span className="past-event-day">{day}</span>
                  {year && <span className="past-event-year">{year}</span>}
                </div>
                <div className="past-event-body">
                  <div className="past-event-meta">
                    <span className="past-event-badge">
                      {t.pastEvents.pastEventBadge}
                    </span>
                    <span className="past-event-status">
                      <span
                        className="past-event-status-dot"
                        aria-hidden="true"
                      />
                      {STATUS_LABEL[lang]}
                    </span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.body}</p>
                  {event.url && (
                    <a
                      className="past-event-link"
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.pastEvents.pastEventRecap}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
