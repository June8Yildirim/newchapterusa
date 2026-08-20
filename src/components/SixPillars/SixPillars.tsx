import "./SixPillars.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import {
  Compass,
  MessagesSquare,
  GraduationCap,
  Map,
  HeartHandshake,
  Crown,
} from "lucide-react";

/** One icon per pillar, in order. */
const PILLAR_ICONS = [
  Compass,
  MessagesSquare,
  GraduationCap,
  Map,
  HeartHandshake,
  Crown,
];

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
          {t.pillars.pillars.map((p, index) => {
            const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length];
            return (
              <article key={p.pillar} className="pillar-card">
                <div className="pillar-card-panel">
                  <div className="pillar-card-icon">
                    <Icon size={44} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="pillar-card-content">
                    <h3>{p.pillar}</h3>
                    <p>{p.pillarDesc}</p>
                  </div>
                </div>
                <div className="pillar-card-number">
                  <p>{String(index + 1).padStart(2, "0")}</p>
                  <span className="pillar-card-kicker">Pillar</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
