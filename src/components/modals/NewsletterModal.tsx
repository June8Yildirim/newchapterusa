import { useState, type ComponentProps } from "react";
import { Modal } from "../../Modal";
import { Button } from "../Button/Button";
// Reuses the shared subscribe-form styles (.contact-form / .contact-success / …).
import "../ContactUs/ContactUs.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined;

export function NewsletterModal({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: Language;
}) {
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
          subject: `${t.newsletterMailSubject}${name ? ` — ${name}` : ""}`,
          from_name: name || "New Chapter subscriber",
          replyto: email,
          [t.mailLabelName]: name,
          [t.mailLabelEmail]: email,
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

  const handleClose = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t.submitNewsletterTitle}
      style={{ maxWidth: "480px" }}
    >
      {submitted ? (
        <div className="contact-success" role="status" aria-live="polite">
          <div className="contact-success-icon" aria-hidden="true">
            ✓
          </div>
          <h3>{t.newsletterSuccessTitle}</h3>
          <p>{t.newsletterSuccessBody}</p>
          <Button variant="gold" onClick={handleClose}>
            {t.close}
          </Button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="contact-intro">{t.newsletterIntro}</p>
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
          {error && (
            <p role="alert" className="contact-error">
              {error}
            </p>
          )}
          <Button variant="gold" block type="submit" disabled={submitting}>
            {submitting ? t.sending : t.newsletterSubmitBtn}
          </Button>
        </form>
      )}
    </Modal>
  );
}
