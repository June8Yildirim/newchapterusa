import { Modal } from "../../Modal";
import { Button } from "../Button/Button";
import { TRANSLATIONS, type Language } from "../../constants/text";

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
  return (
    <Modal open={open} onClose={onClose} title={t.discoveryModalTitle}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const name = String(data.get("name") ?? "");
          const email = String(data.get("email") ?? "");
          const datetime = String(data.get("datetime") ?? "");
          const notes = String(data.get("notes") ?? "");

          const subject = `Discovery Call Request - ${name}`;
          const body = `Name: ${name}\nEmail: ${email}\nPreferred Date/Time: ${datetime}\nNotes: ${notes}`;

          window.location.href = `mailto:hello@newchapter.example?subject=${encodeURIComponent(
            subject,
          )}&body=${encodeURIComponent(body)}`;

          onSubmitted();
        }}
        className="update-form"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input type="text" name="name" placeholder={t.placeholderName} required />
        <input
          type="email"
          name="email"
          placeholder={t.placeholderEmail}
          required
        />
        <input
          type="text"
          name="datetime"
          placeholder={t.discoveryPlaceholderDate}
          required
        />
        <textarea
          name="notes"
          placeholder={t.discoveryPlaceholderMessage}
          rows={4}
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
        <Button variant="gold" block type="submit">
          {t.discoverySubmitBtn}
        </Button>
      </form>
    </Modal>
  );
}
