import "./StatsStrip.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

export const StatsStrip = ({ lang }: { lang: Language }) => {
  const stats = TRANSLATIONS[lang].summary.stats;

  return (
    <section className="section stats-strip-section">
      <section className="container">
        <ul className="stats-strip">
          {stats.map((stat) => (
            <li key={stat.label} className="stats-strip-item">
              <span className="stats-strip-value">{stat.value}</span>
              <span className="stats-strip-subvalue">{stat.subvalue}</span>
              <span className="stats-strip-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default StatsStrip;
