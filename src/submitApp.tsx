import { useState, type ComponentProps } from "react";
import { TRANSLATIONS, type Language } from "./constants/text";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined;

export function SubmitApplication({
  lang,
  setOpenConfirm,
}: {
  lang: Language;
  openConfirm: boolean;
  setOpenConfirm: (tst: boolean) => void;
}) {
  const t = TRANSLATIONS[lang];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const stage = String(data.get("stage") ?? "");
    const barrier = String(data.get("barrier") ?? "");
    const support = String(data.get("support") ?? "");
    const consent = data.get("consent") ? "Yes" : "No";

    if (!WEB3FORMS_ACCESS_KEY) {
      setError(t.sendError);
      // Surface a clear hint for developers if the key is missing.
      console.error(
        "Missing VITE_WEB3FORMS_ACCESS_KEY — set it in your .env.local file.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `${t.mailSubject}${name ? ` — ${name}` : ""}`,
          from_name: name || "New Chapter applicant",
          replyto: email,
          [t.mailLabelName]: name,
          [t.mailLabelEmail]: email,
          [t.mailLabelStage]: stage,
          [t.mailLabelBarrier]: barrier,
          [t.mailLabelSupport]: support,
          [t.mailLabelConsent]: consent,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();
        setOpenConfirm(true);
      } else {
        setError(t.sendError);
      }
    } catch {
      setError(t.sendError);
    } finally {
      setSubmitting(false);
    }
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
          {error && (
            <p role="alert" style={{ color: "#c0392b", margin: 0 }}>
              {error}
            </p>
          )}
          <button
            className="btn btn-gold btn-block"
            type="submit"
            disabled={submitting}
          >
            {submitting ? t.sending : t.submitApplicationBtn}
          </button>
        </form>
      </div>
    </section>
  );
}
