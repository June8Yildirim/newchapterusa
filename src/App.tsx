import { useRef, useState } from "react";
import "./App.css";
import { type Language } from "./constants/text";
import { useSiteAnimations } from "./useSiteAnimations";
import { testimonals } from "./constants/testimonals";
import TestimonialsCarousel from "./components/Testimonals/Testimonals";
import HappenningSoon from "./components/happenningsoon/HappenningSoon";
import SixPillars from "./components/SixPillars/SixPillars";
import Publications from "./components/Publications/Publications";
import Navigation from "./components/navigation/Navigation";
import ComingSoon from "./components/ComingSoon/ComingSoon";
import { CtaForm } from "./components/CTAForm/CtaForm";
import { Footer } from "./components/Footer/Footer";
import PreFooterCallout from "./components/PreFooterCallout/PreFooterCallout";
import { Hero } from "./components/Hero/Hero";
import Network from "./components/Network/Network";
import HowWeWork from "./components/HowWeWork/HowWeWork";
import NextSteps from "./components/NextSteps/NextSteps";
import LogosCarousel from "./components/LogosCarousel/LogosCarousel";
import StatsStrip from "./components/StatsStrip/StatsStrip";
import { ComingSoonModal } from "./components/modals/ComingSoonModal";
import { TestimonialModal } from "./components/modals/TestimonialModal";
import { ContactModal } from "./components/modals/ContactModal";
import { ApplicationModal } from "./components/modals/ApplicationModal";
import { AppReceivedModal } from "./components/modals/AppReceivedModal";
import { DiscoveryModal } from "./components/modals/DiscoveryModal";
import { DiscoverySuccessModal } from "./components/modals/DiscoverySuccessModal";
import { NewsletterModal } from "./components/modals/NewsletterModal";
import { AdminModal } from "./components/modals/AdminModal";

function App() {
  const [openTestimonal, setOpenTestimonal] = useState<
    (typeof testimonals)[number] | null
  >(null);
  const [confirmSubmitApplicationOpen, setConfirmSubmitAppicationOpen] =
    useState(false);
  const [confirmSubmitNewsletterOpen, setConfirmSubmitNewsletterOpen] =
    useState(false);
  const [openComingSoonModal, setOpenComingSoonModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [openDiscovery, setOpenDiscovery] = useState(false);
  const [openDiscoveryConfirm, setOpenDiscoveryConfirm] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  useSiteAnimations(container);

  const isComingSoon = false; // Set to true to show the Coming Soon under construction page

  if (isComingSoon) {
    return <ComingSoon lang={lang} setLang={setLang} />;
  }

  return (
    <div className="page" ref={container}>
      <Navigation
        lang={lang}
        setLang={setLang}
        onContact={() => setOpenContact(true)}
      />

      {/* Hero */}
      <Hero
        lang={lang}
        onNewsletter={() => setConfirmSubmitNewsletterOpen(true)}
        onWaitlist={() => setConfirmSubmitAppicationOpen(true)}
        onContact={() => setOpenContact(true)}
      />

      <StatsStrip lang={lang} />

      {/* <div id="coach" className="nav-anchor"> */}
      {/*   <MeetingCoaching lang={lang} /> */}
      {/* </div> */}
      <LogosCarousel lang={lang} />

      <Publications lang={lang} />
      <SixPillars
        lang={lang}
        openComingSoonModal={openComingSoonModal}
        setOpenComingSoonModal={setOpenComingSoonModal}
      />
      <Network
        lang={lang}
        onNewsletter={() => setConfirmSubmitNewsletterOpen(true)}
        onWaitlist={() => setConfirmSubmitAppicationOpen(true)}
      />
      <HowWeWork lang={lang} />
      <NextSteps lang={lang} onDiscovery={() => setOpenDiscovery(true)} />
      {/* <Announcments lang={lang} /> */}
      <HappenningSoon lang={lang} />

      <TestimonialsCarousel lang={lang} setOpenTestimonal={setOpenTestimonal} />

      <section className="section">
        <div id="cta" className="nav-anchor">
          <CtaForm
            lang={lang}
            setConfirmOpen={setConfirmSubmitNewsletterOpen}
          />
        </div>

        <PreFooterCallout lang={lang} />
      </section>

      {/* Footer */}
      <Footer
        lang={lang}
        onContact={() => setOpenContact(true)}
        onAdmin={() => setOpenAdmin(true)}
      />

      <AdminModal
        open={openAdmin}
        onClose={() => setOpenAdmin(false)}
        lang={lang}
      />

      <ComingSoonModal
        open={openComingSoonModal}
        onClose={() => setOpenComingSoonModal(false)}
        lang={lang}
        setLang={setLang}
      />

      <TestimonialModal
        testimonial={openTestimonal}
        onClose={() => setOpenTestimonal(null)}
      />

      <ContactModal
        open={openContact}
        onClose={() => setOpenContact(false)}
        lang={lang}
      />

      <ApplicationModal
        open={confirmSubmitApplicationOpen}
        onClose={() => setConfirmSubmitAppicationOpen(false)}
        lang={lang}
        openConfirm={openConfirm}
        setOpenConfirm={setOpenConfirm}
      />

      <NewsletterModal
        open={confirmSubmitNewsletterOpen}
        onClose={() => setConfirmSubmitNewsletterOpen(false)}
        lang={lang}
      />

      <AppReceivedModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onCloseClick={() => setConfirmSubmitAppicationOpen(false)}
        lang={lang}
      />

      <DiscoveryModal
        open={openDiscovery}
        onClose={() => setOpenDiscovery(false)}
        onSubmitted={() => {
          setOpenDiscovery(false);
          setOpenDiscoveryConfirm(true);
        }}
        lang={lang}
      />

      <DiscoverySuccessModal
        open={openDiscoveryConfirm}
        onClose={() => setOpenDiscoveryConfirm(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
