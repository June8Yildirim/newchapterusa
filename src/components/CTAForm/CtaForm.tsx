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
        <h2>{t.discoveryTitle}</h2>
        <p>{t.discoveryDesc}</p>
        <div className="cta-buttons">
          <a
            target="_blank"
            className="btn btn-gold"
            href={
              "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ136Fnid8w6QWB6KxetgCQrMGoNfBYgeEg9yaaeATKMb3OG7GN50d-DwTgT65mFaugttMcDgOuR"
            }
          >
            {t.discoveryBtn}
          </a>
          <Button variant="blue" onClick={() => setConfirmOpen(true)}>
            {t.submitApplicationBtn}
          </Button>
        </div>
      </div>
    </section>
  );
};
