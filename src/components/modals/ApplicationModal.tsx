import { Modal } from "../../Modal";
import { SubmitApplication } from "../../submitApp";
import { TRANSLATIONS, type Language } from "../../constants/text";

export function ApplicationModal({
  open,
  onClose,
  lang,
  openConfirm,
  setOpenConfirm,
}: {
  open: boolean;
  onClose: () => void;
  lang: Language;
  openConfirm: boolean;
  setOpenConfirm: (open: boolean) => void;
}) {
  const t = TRANSLATIONS[lang];
  return (
    <Modal open={open} onClose={onClose} title={t.application.submitApplicationTitle}>
      <SubmitApplication
        lang={lang}
        openConfirm={openConfirm}
        setOpenConfirm={setOpenConfirm}
      />
    </Modal>
  );
}
