import { Modal } from "../../Modal";
import ContactUs from "../ContactUs/ContactUs";
import { TRANSLATIONS, type Language } from "../../constants/text";

export function ContactModal({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: Language;
}) {
  const t = TRANSLATIONS[lang];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.navFooter.contactTitle}
      style={{ maxWidth: "560px" }}
    >
      <ContactUs lang={lang} />
    </Modal>
  );
}
