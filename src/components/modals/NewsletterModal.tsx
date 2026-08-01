import { useState, type ComponentProps } from "react";
import { Modal } from "../../Modal";
import { Button } from "../Button/Button";
// Reuses the shared subscribe-form styles (.contact-form / .contact-success / …).
import "../ContactUs/ContactUs.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { isFilled, isValidEmail } from "../../utils/validation";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Name and a valid email are required — the Subscribe button stays muted until both pass.
  const canSubmit = isFilled(name) && isValidEmail(email);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (submitting || !canSubmit) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const focus = String(data.get("focus") ?? "");

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
          [t.newsletterFocusLabel]: focus,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();
        setName("");
        setEmail("");
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
    setName("");
    setEmail("");
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

          <label className="field-label">
            {t.newsletterNameLabel}
            <input
              type="text"
              name="name"
              placeholder={t.placeholderName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field-label">
            {t.newsletterEmailLabel}
            <input
              type="email"
              name="email"
              placeholder={t.newsletterEmailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field-label">
            {t.newsletterFocusLabel}
            <select name="focus" defaultValue="">
              <option value="" disabled>
                {t.newsletterFocusPlaceholder}
              </option>
              {t.newsletterFocusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p role="alert" className="contact-error">
              {error}
            </p>
          )}
          <Button
            variant="gold"
            block
            type="submit"
            disabled={submitting || !canSubmit}
          >
            {submitting ? t.sending : t.newsletterSubmitBtn}
          </Button>
          <p className="newsletter-privacy">🔒 {t.newsletterPrivacyNote}</p>
        </form>
      )}
    </Modal>
  );
}
