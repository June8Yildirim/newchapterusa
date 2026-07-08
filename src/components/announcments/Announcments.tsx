import { TRANSLATIONS, type Language } from "../../constants/text";

export default function Announcments({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];

  return (
    <section className="section announcements">
      {/* Announcements */}
      <div className="container">
        <h2>{t.announcementsTitle}</h2>
        <p className="muted small">{t.announcementsSubTitle}</p>
        <div className="announcement-list">
          {t.announcements.map((item) => (
            <article key={item.title} className="announcement-card">
              <span className="announcement-tag">{item.tag}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
