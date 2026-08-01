import "./Network.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export default function Network({
  lang,
  onNewsletter,
  onWaitlist,
}: {
  lang: Language;
  onNewsletter: () => void;
  onWaitlist: () => void;
}) {
  const t = TRANSLATIONS[lang];
  const n = t.network;

  return (
    <section className="section network">
      <div className="container network-inner">
        <h2>{n.title}</h2>
        <p>{n.p1}</p>
        <p>{n.p2}</p>
        <p className="network-cta-text">{n.p3}</p>
        <div className="network-actions">
          <Button variant="gold" onClick={onNewsletter}>
            {n.newsletterBtn}
          </Button>
          <Button variant="blue" onClick={onWaitlist}>
            {n.waitlistBtn}
          </Button>
        </div>
      </div>
    </section>
  );
}
