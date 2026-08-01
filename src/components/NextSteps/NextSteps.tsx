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
        <h2 className="next-steps-eyebrow">{s.eyebrow}</h2>
        <h3>{s.title}</h3>
        <p className="next-steps-subtitle">{s.subtitle}</p>
        <p className="next-steps-detail">{s.detail}</p>
        <Button variant="gold" onClick={onDiscovery}>
          {s.ctaBtn}
        </Button>
      </div>
    </section>
  );
}
