import { Modal } from "../../Modal";
import { Button } from "../Button/Button";
import { TRANSLATIONS, type Language } from "../../constants/text";

export function DiscoverySuccessModal({
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
    <Modal open={open} onClose={onClose} title={t.discoverySuccessTitle}>
      <p>{t.discoverySuccessBody}</p>
      <Button variant="gold" block onClick={onClose}>
        {t.close}
      </Button>
    </Modal>
  );
}
