import "./SixPillars.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function SixPillars({
  lang,
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
        <div className="section-header">
          <h2>{t.pillarsTitle}</h2>
          <p>{t.pillarsSubtitle}</p>
        </div>
        <div className="pillar-grid">
          {t.pillars.map((p) => (
            <article key={p.pillar} className="pillar-card">
              <h3>{p.pillar}</h3>
              <p>{p.pillarDesc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
