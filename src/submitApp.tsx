import { type ComponentProps } from "react";
import { TRANSLATIONS, type Language } from "./constants/text";

export function SubmitApplication({
  lang,
  setOpenConfirm,
}: {
  lang: Language;
  openConfirm: boolean;
  setOpenConfirm: (tst: boolean) => void;
}) {
  const t = TRANSLATIONS[lang];
  const CONTACT_EMAIL = "hello@newchapter.example";
  
  function buildMailtoHref(data: FormData) {
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const stage = String(data.get("stage") ?? "");
    const barrier = String(data.get("barrier") ?? "");
    const support = String(data.get("support") ?? "");
    const consent = data.get("consent") ? "Yes" : "No";

    const subject = `${t.mailSubject}${name ? ` — ${name}` : ""}`;
    const body = [
      `${t.mailLabelName}: ${name}`,
      `${t.mailLabelEmail}: ${email}`,
      `${t.mailLabelStage}: ${stage}`,
      `${t.mailLabelBarrier}: ${barrier}`,
      `${t.mailLabelSupport}: ${support}`,
      `${t.mailLabelConsent}: ${consent}`,
    ].join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    const href = buildMailtoHref(new FormData(e.currentTarget));
    setOpenConfirm(true);
    window.location.href = href;
  };

  return (
    <section className="section update">
      <div className="container">
        <form className="update-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder={t.placeholderName} required />
          <input type="email" name="email" placeholder={t.placeholderEmail} required />
          <input
            type="text"
            name="stage"
            placeholder={t.placeholderStage}
          />
          <input type="text" name="barrier" placeholder={t.placeholderBarrier} />
          <input
            type="text"
            name="support"
            placeholder={t.placeholderSupport}
          />
          <label className="checkbox-row">
            <input type="checkbox" name="consent" />
            <span>{t.consentText}</span>
          </label>
          <button className="btn btn-gold btn-block" type="submit">
            {t.submitApplicationBtn}
          </button>
        </form>
      </div>
    </section>
  );
}
