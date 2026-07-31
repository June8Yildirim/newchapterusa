import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export default function HappenningSoon({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];

  return (
    <section className="section happening">
      {/* Happening Soon */}
      <div className="container">
        <h2>{t.happeningSoonTitle}</h2>
        <p className="muted small">{t.announcementsSubTitle}</p>
        <div className="happening-grid">
          {t.upcomingEvents.map((event) => (
            <article key={event.title} className="happening-card">
              <div className="happening-date">{event.date}</div>
              <div className="happening-body">
                <h3>{event.title}</h3>
                <p>{event.body}</p>
                <Button variant="gold">{t.reserveSpot}</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
