import { useState, type ComponentProps } from "react";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined;

export default function ContactUs({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

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
          subject: `${t.contactMailSubject}${name ? ` — ${name}` : ""}`,
          from_name: name || "New Chapter contact",
          replyto: email,
          [t.mailLabelName]: name,
          [t.mailLabelEmail]: email,
          Message: message,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();
        setSubmitted(true);
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
    <div className="contact">
      {submitted ? (
        <div className="contact-success" role="status" aria-live="polite">
          <div className="contact-success-icon" aria-hidden="true">
            ✓
          </div>
          <h3>{t.contactSuccessTitle}</h3>
          <p>{t.contactSuccessBody}</p>
          <Button variant="gold" onClick={() => setSubmitted(false)}>
            {t.contactSendAnother}
          </Button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="contact-intro">{t.contactSubtitle}</p>
          <input
            type="text"
            name="name"
            placeholder={t.placeholderName}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t.placeholderEmail}
            required
          />
          <textarea
            name="message"
            rows={4}
            placeholder={t.contactMessagePlaceholder}
          />
          {error && (
            <p role="alert" className="contact-error">
              {error}
            </p>
          )}
          <Button variant="gold" block type="submit" disabled={submitting}>
            {submitting ? t.sending : t.contactSubmitBtn}
          </Button>
        </form>
      )}
    </div>
  );
}
