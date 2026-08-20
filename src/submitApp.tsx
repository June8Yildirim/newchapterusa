import { useState, type ComponentProps } from "react";
import "./submitApp.css";
import { TRANSLATIONS, type Language } from "./constants/text";
import { Button } from "./components/Button/Button";
import { isFilled, isValidEmail } from "./utils/validation";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Name + a valid email are required before the button activates.
  const canSubmit = isFilled(name) && isValidEmail(email);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (submitting || !canSubmit) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const stage = String(data.get("stage") ?? "");
    const barrier = String(data.get("barrier") ?? "");
    const support = String(data.get("support") ?? "");
    const consent = data.get("consent") ? "Yes" : "No";

    if (!WEB3FORMS_ACCESS_KEY) {
      setError(t.application.sendError);
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
          subject: `${t.application.mailSubject}${name ? ` — ${name}` : ""}`,
          from_name: name || "New Chapter applicant",
          replyto: email,
          [t.application.mailLabelName]: name,
          [t.application.mailLabelEmail]: email,
          [t.application.mailLabelStage]: stage,
          [t.application.mailLabelBarrier]: barrier,
          [t.application.mailLabelSupport]: support,
          [t.application.mailLabelConsent]: consent,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();
        setName("");
        setEmail("");
        setOpenConfirm(true);
      } else {
        setError(t.application.sendError);
      }
    } catch {
      setError(t.application.sendError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section update">
      <div className="container">
        <form className="update-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder={t.application.placeholderName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t.application.placeholderEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input type="text" name="stage" placeholder={t.application.placeholderStage} />
          <input
            type="text"
            name="barrier"
            placeholder={t.application.placeholderBarrier}
          />
          <input
            type="text"
            name="support"
            placeholder={t.application.placeholderSupport}
          />
          {/* <label className="checkbox-row"> */}
          {/*   <input type="checkbox" name="consent" /> */}
          {/*   <span>{t.consentText}</span> */}
          {/* </label> */}
          {error && (
            <p role="alert" style={{ color: "#c0392b", margin: 0 }}>
              {error}
            </p>
          )}
          <Button
            variant="gold"
            block
            type="submit"
            disabled={submitting || !canSubmit}
          >
            {submitting ? t.application.sending : t.application.sendApplication}
          </Button>
        </form>
      </div>
    </section>
  );
}
