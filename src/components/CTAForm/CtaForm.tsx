import "./CtaForm.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export const CtaForm = ({
  lang,
  setConfirmOpen,
}: {
  lang: Language;
  setConfirmOpen: (str: boolean) => void;
}) => {
  const t = TRANSLATIONS[lang];
  return (
    <section className="container">
      {/* CTA form */}
      <div className="cta-banner">
        <h2>{t.discovery.discoveryTitle}</h2>
        <p>{t.discovery.discoveryDesc}</p>
        <div className="cta-buttons">
          <Button
            variant="gold"
            className="hero-cta"
            onClick={() => {
              window.open(
                "https://calendar.app.google/1r6MpUrGYqG3ViSR7",
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            {t.discovery.discoveryBtn}
          </Button>
          <Button variant="blue" onClick={() => setConfirmOpen(true)}>
            {t.application.submitApplicationBtn}
          </Button>
        </div>
      </div>
    </section>
  );
};
