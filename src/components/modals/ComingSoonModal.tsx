import { Modal } from "../../Modal";
import ComingSoon from "../ComingSoon/ComingSoon";
import { type Language } from "../../constants/text";

export function ComingSoonModal({
  open,
  onClose,
  lang,
  setLang,
}: {
  open: boolean;
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Under Construction"}
      style={{ maxWidth: "1080px", height: "800px" }}
    >
      {open && <ComingSoon lang={lang} setLang={setLang} />}
    </Modal>
  );
}
