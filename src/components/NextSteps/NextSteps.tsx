import "./NextSteps.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export default function NextSteps({
  lang,
  onDiscovery,
}: {
  lang: Language;
  onDiscovery: () => void;
}) {
  const t = TRANSLATIONS[lang];
  const s = t.nextSteps;

  return (
    <section className="section next-steps">
      <div className="container next-steps-inner">
        <div className="section-header">
          <h2 className="title">{s.title}</h2>
          <h3 className="eyebrow">{s.eyebrow}</h3>
          <p className="subtitle">{s.subtitle}</p>
          <p className="description">{s.detail}</p>
        </div>
        <Button variant="gold" onClick={onDiscovery}>
          {s.ctaBtn}
        </Button>
      </div>
    </section>
  );
}
