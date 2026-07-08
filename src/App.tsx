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
      <section className="hero">
        <div className="container hero-inner">
          {/* <h1 className="hero-sub">Write Your Next Chapter</h1> */}
          {/* <div className="hero-actions"></div> */}
        </div>
      </section>

      <MeetingCoaching lang={lang} />
      <Publications
        lang={lang}
        openComingSoonModal={openComingSoonModal}
        setOpenComingSoonModal={setOpenComingSoonModal}
      />
      <SixPillars
        lang={lang}
        openComingSoonModal={openComingSoonModal}
        setOpenComingSoonModal={setOpenComingSoonModal}
      />
      {/* <Announcments lang={lang} /> */}
      <HappenningSoon lang={lang} />

      <TestimonialsCarousel setOpenTestimonal={setOpenTestimonal} />
      <CtaForm lang={lang} setConfirmOpen={setConfirmOpen} />

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand-section">
            <span className="footer-brand">{t.brand}</span>
            <span
              className="footer-coach-credentials"
              style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              Dr. Mehtap Akay, PhD — {t.brand}
            </span>
            <p className="footer-desc" style={{ marginTop: "4px" }}>
              {t.footerDesc}
            </p>
          </div>
          <div className="footer-links">
            <a
              href="https://www.linkedin.com/in/mehtap-akay-phd-4395a122"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ verticalAlign: "middle" }}
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>{t.footerConnect}</span>
            </a>
            <span className="footer-copyright">{t.footerCopyright}</span>
            <span
              className="footer-copyright"
              style={{ marginTop: "4px", fontSize: "0.75rem", opacity: 0.6 }}
            >
              {t.developedBy}
            </span>
          </div>
        </div>
      </footer>

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
