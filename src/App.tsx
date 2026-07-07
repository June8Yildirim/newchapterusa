import { useRef, useState } from "react";
import "./App.css";
import {
  TRANSLATIONS,
  LOREM,
  LOREM_SHORT,
  type Language,
} from "./constants/text";
import { Modal } from "./Modal";
import { SubmitApplication } from "./submitApp";
import { useSiteAnimations } from "./useSiteAnimations";
import { testimonals } from "./constants/testimonals";
import TestimonialsCarousel from "./components/Testimonals/Testimonals";
import TestimonialItem from "./components/Testimonals/TestimonalItem";
import HappenningSoon from "./components/happenningsoon/HappenningSoon";
import Announcments from "./components/announcments/Announcments";
import SixPillars from "./components/SixPillars/SixPillars";
import Publications from "./components/Publications/Publications";
import MeetingCoaching from "./components/MeetingCoaching/MeetingCoaching";
import Navigation from "./components/navigation/Navigation";

function App() {
  const [openTestimonal, setOpenTestimonal] = useState<
    (typeof testimonals)[number] | null
  >(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [openDiscovery, setOpenDiscovery] = useState(false);
  const [openDiscoveryConfirm, setOpenDiscoveryConfirm] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  useSiteAnimations(container);

  const t = TRANSLATIONS[lang];

  return (
    <div className="page" ref={container}>
      <Navigation lang={lang} setLang={setLang} />
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          {/* <h1 className="hero-sub">Write Your Next Chapter</h1> */}
          {/* <div className="hero-actions"></div> */}
        </div>
      </section>

      <MeetingCoaching lang={lang} />
      <Publications lang={lang} />
      <SixPillars lang={lang} />
      <Announcments lang={lang} />
      <HappenningSoon lang={lang} />

      <TestimonialsCarousel setOpenTestimonal={setOpenTestimonal} />

      {/* CTA form */}
      <section className="container">
        <div className="cta-banner">
          <h2>{t.discoveryTitle}</h2>
          <p>{t.discoveryDesc}</p>
          <div className="cta-buttons">
            <button
              className="btn btn-gold"
              onClick={() => setOpenDiscovery(true)}
            >
              {t.discoveryBtn}
            </button>
            <button
              className="btn btn-blue"
              onClick={() => setConfirmOpen(true)}
            >
              {t.submitApplicationBtn}
            </button>
          </div>
        </div>
      </section>

      <Modal
        open={!!openTestimonal}
        onClose={() => setOpenTestimonal(null)}
        title={openTestimonal ? openTestimonal.name : "Testimonial"}
        style={{ maxWidth: "680px" }}
      >
        {openTestimonal && (
          <TestimonialItem
            name={openTestimonal.name}
            job={openTestimonal.job}
            post={openTestimonal.post}
            significant={openTestimonal.significant}
          />
        )}
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t.submitApplicationTitle}
      >
        <SubmitApplication
          lang={lang}
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
        />
      </Modal>

      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title={t.appReceived}
      >
        <p>{t.thanksApplying}</p>
        <button
          type="button"
          className="btn btn-gold btn-block"
          onClick={() => setConfirmOpen(false)}
        >
          {t.close}
        </button>
      </Modal>

      <Modal
        open={openDiscovery}
        onClose={() => setOpenDiscovery(false)}
        title={t.discoveryModalTitle}
      >
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

            setOpenDiscovery(false);
            setOpenDiscoveryConfirm(true);
          }}
          className="update-form"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="text"
            name="name"
            placeholder={t.placeholderName}
            required
          />
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
          <button className="btn btn-gold btn-block" type="submit">
            {t.discoverySubmitBtn}
          </button>
        </form>
      </Modal>

      <Modal
        open={openDiscoveryConfirm}
        onClose={() => setOpenDiscoveryConfirm(false)}
        title={t.discoverySuccessTitle}
      >
        <p>{t.discoverySuccessBody}</p>
        <button
          type="button"
          className="btn btn-gold btn-block"
          onClick={() => setOpenDiscoveryConfirm(false)}
        >
          {t.close}
        </button>
      </Modal>
    </div>
  );
}

export default App;
