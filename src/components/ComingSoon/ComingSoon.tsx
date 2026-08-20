import { useState } from "react";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Modal } from "../../Modal";
import { CtaForm } from "../CTAForm/CtaForm";
import { SubmitApplication } from "../../submitApp";
import { Button } from "../Button/Button";
import "./comingsoon.css";

export default function ComingSoon({
  lang,
  setLang,
}: {
  lang: Language;
  setLang: (l: Language) => void;
}) {
  const [openNotify, setOpenNotify] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const t = TRANSLATIONS[lang];

  return (
    <div className="coming-soon-page">
      {/* Language Switcher */}
      <div className="coming-soon-lang">
        <button
          className={`coming-soon-lang-btn ${lang === "en" ? "active" : ""}`}
          onClick={() => setLang("en")}
          type="button"
        >
          EN
        </button>
        <button
          className={`coming-soon-lang-btn ${lang === "tr" ? "active" : ""}`}
          onClick={() => setLang("tr")}
          type="button"
        >
          TR
        </button>
      </div>

      <div className="coming-soon-container">
        <h1 className="coming-soon-title">{t.comingSoon.comingSoonTitle}</h1>
        <p className="coming-soon-subtitle">{t.comingSoon.comingSoonSubtitle}</p>
        <p className="coming-soon-desc">{t.comingSoon.comingSoonDesc}</p>
        <button
          className="notify-btn"
          onClick={() => setOpenNotify(true)}
          type="button"
        >
          {t.comingSoon.comingSoonBtn}
        </button>
      </div>

      {/* Notify Modal containing CtaForm */}
      <Modal
        open={openNotify}
        onClose={() => setOpenNotify(false)}
        title={t.comingSoon.notifyModalTitle}
        style={{ maxWidth: "600px" }}
      >
        <div style={{ margin: "-16px" }}>
          <CtaForm
            lang={lang}
            setConfirmOpen={(val) => {
              setOpenNotify(false);
              setConfirmOpen(val);
            }}
          />
        </div>
      </Modal>

      {/* Newsletter Subscription Modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t.newsletter.submitNewsletterTitle}
      >
        <SubmitApplication
          lang={lang}
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
        />
      </Modal>

      {/* Subscription Confirmation Modal */}
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title={t.application.appReceived}
      >
        <p>{t.application.thanksApplying}</p>
        <Button variant="gold" block onClick={() => setOpenConfirm(false)}>
          {t.application.close}
        </Button>
      </Modal>
    </div>
  );
}
