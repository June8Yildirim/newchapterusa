import { TRANSLATIONS, LOREM_SHORT, type Language } from "../../constants/text";

export default function SixPillars({
  lang,
  openComingSoonModal,
  setOpenComingSoonModal,
}: {
  lang: Language;
  openComingSoonModal: boolean;
  setOpenComingSoonModal: (str: boolean) => void;
}) {
  const t = TRANSLATIONS[lang];

  return (
    <section className="section pillars">
      {/* 6 Pillars */}
      <div className="container">
        <h2>{t.pillarsTitle}</h2>
        <p className="muted small">{LOREM_SHORT}</p>
        <div className="pillar-grid">
          {t.pillars.map((title) => (
            <article key={title} className="pillar-card">
              <h3>{title}</h3>
              <p>{t.supportingDescription}</p>
              <button
                onClick={() => setOpenComingSoonModal(!openComingSoonModal)}
                className="btn btn-gold btn-block"
                type="button"
              >
                {t.watchSampleWebinar}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
