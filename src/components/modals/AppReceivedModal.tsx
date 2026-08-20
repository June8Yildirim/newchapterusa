import { Modal } from "../../Modal";
import { Button } from "../Button/Button";
import { TRANSLATIONS, type Language } from "../../constants/text";

export function AppReceivedModal({
  open,
  onClose,
  onCloseClick,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  onCloseClick: () => void;
  lang: Language;
}) {
  const t = TRANSLATIONS[lang];
  return (
    <Modal open={open} onClose={onClose} title={t.application.appReceived}>
      <p>{t.application.thanksApplying}</p>
      <Button variant="gold" block onClick={onCloseClick}>
        {t.application.close}
      </Button>
    </Modal>
  );
}
