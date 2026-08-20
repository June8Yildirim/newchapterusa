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
    <section id="pillars" className="section pillars nav-anchor">
      {/* 6 Pillars */}
      <div className="container">
        <div className="section-header">
          <h2>{t.pillars.pillarsTitle}</h2>
          <p>{t.pillars.pillarsSubtitle}</p>
        </div>
        <div className="pillar-grid">
          {t.pillars.pillars.map((p, index) => (
            <article key={p.pillar} className="pillar-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="pillar-card-number">
                  <p>{index + 1}</p>
                </div>
                <span className="pillar-card-icon">icon</span>
              </div>
              <div>
                <h3>{p.pillar}</h3>
                <p>{p.pillarDesc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
