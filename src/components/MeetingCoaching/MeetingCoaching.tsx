import { TRANSLATIONS, type Language } from "../../constants/text";
import { PhotoPlaceholder } from "../../PhotoPlaceholder";

export default function MeetingCoaching({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const creds = t.credentialsRich;

  return (
    <section className="section coach">
      {/* Meet Your Coach */}
      <div className="container coach-inner">
        <div className="coach-text">
          <h2>{t.meetCoach}</h2>
          <p className="coach-subtitle" style={{ fontSize: "1.1rem", fontWeight: "500", color: "var(--turquoise)", marginBlock: "8px 20px" }}>
            {t.coachSubtitle}
          </p>
          <ul className="credentials" style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "20px" }}>
            <li>
              <strong>{creds.coaching.title}: </strong>
              {creds.coaching.beforeKoc}
              <a href={creds.coaching.kocUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                {creds.coaching.kocText}
              </a>
              {creds.coaching.betweenKocIcf}
              <a href={creds.coaching.icfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                {creds.coaching.icfText}
              </a>
              {creds.coaching.afterIcf}
            </li>
            <li>
              <strong>{creds.academic.title}: </strong>
              {creds.academic.detail}
            </li>
            <li>
              <strong>{creds.systemic.title}: </strong>
              {creds.systemic.detail}
            </li>
          </ul>
        </div>
        <PhotoPlaceholder />
      </div>
    </section>
  );
}
