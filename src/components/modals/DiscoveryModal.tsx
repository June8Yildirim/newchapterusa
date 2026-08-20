import { useState, type ComponentProps } from "react";
import { Modal } from "../../Modal";
import { Button } from "../Button/Button";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { isFilled, isValidEmail } from "../../utils/validation";

export function DiscoveryModal({
  open,
  onClose,
  onSubmitted,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  lang: Language;
}) {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [datetime, setDatetime] = useState("");
  const [notes, setNotes] = useState("");

  // Name, a valid email, and a preferred date/time are required.
  const canSubmit = isFilled(name) && isValidEmail(email) && isFilled(datetime);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const subject = `Discovery Call Request - ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nPreferred Date/Time: ${datetime}\nNotes: ${notes}`;

    window.location.href = `mailto:hello@newchapter.example?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setName("");
    setEmail("");
    setDatetime("");
    setNotes("");
    onSubmitted();
  };

  return (
    <Modal open={open} onClose={onClose} title={t.discovery.discoveryModalTitle}>
      <form
        onSubmit={handleSubmit}
        className="update-form"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
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
        <input
          type="text"
          name="datetime"
          placeholder={t.discovery.discoveryPlaceholderDate}
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
        <textarea
          name="notes"
          placeholder={t.discovery.discoveryPlaceholderMessage}
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: "#fff",
            color: "var(--ink)",
            fontFamily: "inherit",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
        <Button variant="gold" block type="submit" disabled={!canSubmit}>
          {t.discovery.discoverySubmitBtn}
        </Button>
      </form>
    </Modal>
  );
}
