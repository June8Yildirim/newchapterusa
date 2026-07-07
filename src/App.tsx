import { useRef, useState } from "react";
import "./App.css";
import { TRANSLATIONS, type Language } from "./constants/text";
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
      <section className="section flexing">
        <h2 className="center">{t.latestUpdate}</h2>
        <button
          className="btn btn-gold"
          onClick={() => setConfirmOpen(!confirmOpen)}
        >
          {t.sendApplication}
        </button>
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
    </div>
  );
}

export default App;
