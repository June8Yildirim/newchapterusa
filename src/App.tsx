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
import SixPillars from "./components/SixPillars/SixPillars";
import Publications from "./components/Publications/Publications";
import MeetingCoaching from "./components/MeetingCoaching/MeetingCoaching";
import Navigation from "./components/navigation/Navigation";
import ComingSoon from "./components/ComingSoon/ComingSoon";
import { CtaForm } from "./components/CTAForm/CtaForm";
import { Footer } from "./components/Footer/Footer";
import { Hero } from "./components/Hero/Hero";
import { Button } from "./components/Button/Button";
import Network from "./components/Network/Network";
import HowWeWork from "./components/HowWeWork/HowWeWork";
import NextSteps from "./components/NextSteps/NextSteps";

function App() {
  const [openTestimonal, setOpenTestimonal] = useState<
    (typeof testimonals)[number] | null
  >(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openComingSoonModal, setOpenComingSoonModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [openDiscovery, setOpenDiscovery] = useState(false);
  const [openDiscoveryConfirm, setOpenDiscoveryConfirm] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  useSiteAnimations(container);

  const t = TRANSLATIONS[lang];

  const isComingSoon = false; // Set to true to show the Coming Soon under construction page

  if (isComingSoon) {
    return <ComingSoon lang={lang} setLang={setLang} />;
  }

  return (
    <div className="page" ref={container}>
      <Navigation lang={lang} setLang={setLang} />

      {/* Hero */}
      <Hero lang={lang} />

      <div id="coach" className="nav-anchor">
        <MeetingCoaching lang={lang} />
      </div>

      <div id="publications" className="nav-anchor">
        <Publications
          lang={lang}
          openComingSoonModal={openComingSoonModal}
          setOpenComingSoonModal={setOpenComingSoonModal}
        />
      </div>
      <div id="pillars" className="nav-anchor">
        <SixPillars
          lang={lang}
          openComingSoonModal={openComingSoonModal}
          setOpenComingSoonModal={setOpenComingSoonModal}
        />
      </div>
      <div id="community" className="nav-anchor">
        <Network
          lang={lang}
          onNewsletter={() => setConfirmOpen(true)}
          onWaitlist={() => setConfirmOpen(true)}
        />
      </div>
      <div id="services" className="nav-anchor">
        <HowWeWork lang={lang} />
      </div>
      <div id="next-steps" className="nav-anchor">
        <NextSteps lang={lang} onDiscovery={() => setOpenDiscovery(true)} />
      </div>
      {/* <Announcments lang={lang} /> */}
      <div id="events" className="nav-anchor">
        <HappenningSoon lang={lang} />
      </div>

      <TestimonialsCarousel setOpenTestimonal={setOpenTestimonal} />

      <div id="cta" className="nav-anchor">
        <CtaForm lang={lang} setConfirmOpen={setConfirmOpen} />
      </div>

      {/* Footer */}
      <Footer />

      <Modal
        open={openComingSoonModal}
        onClose={() => setOpenComingSoonModal(false)}
        title={"Under Construction"}
        style={{ maxWidth: "1080px", height: "800px" }}
      >
        {openComingSoonModal && <ComingSoon lang={lang} setLang={setLang} />}
      </Modal>
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
        <Button variant="gold" block onClick={() => setConfirmOpen(false)}>
          {t.close}
        </Button>
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
          <Button variant="gold" block type="submit">
            {t.discoverySubmitBtn}
          </Button>
        </form>
      </Modal>

      <Modal
        open={openDiscoveryConfirm}
        onClose={() => setOpenDiscoveryConfirm(false)}
        title={t.discoverySuccessTitle}
      >
        <p>{t.discoverySuccessBody}</p>
        <Button
          variant="gold"
          block
          onClick={() => setOpenDiscoveryConfirm(false)}
        >
          {t.close}
        </Button>
      </Modal>
    </div>
  );
}

export default App;
