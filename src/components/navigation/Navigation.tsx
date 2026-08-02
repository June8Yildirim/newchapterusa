import { useEffect, useState } from "react";
import "./Navigation.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

// `id` → the section's anchor id in App.tsx; `key` → a key in t.nav (the label).
const NAV_LINKS = [
  { id: "meetcoach", key: "meetcoach" },
  { id: "research", key: "research" },
  { id: "pillars", key: "pillars" },
  { id: "events", key: "events" },
] as const;

export default function Navigation({
  lang,
  setLang,
  onContact,
}: {
  setLang: (str: Language) => void;
  lang: Language;
  onContact: () => void;
}) {
  const t = TRANSLATIONS[lang];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const goTo = (id: string) => {
    setOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goTop = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scroll-spy: highlight the link for the section currently in view.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headerOffset = 140;
          let currentActive = "";

          const isAtBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 60;

          if (isAtBottom) {
            currentActive = NAV_LINKS[NAV_LINKS.length - 1].id;
          } else {
            for (const link of NAV_LINKS) {
              const el = document.getElementById(link.id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= headerOffset && rect.bottom > 0) {
                  currentActive = link.id;
                }
              }
            }
            if (!currentActive && window.scrollY < 300) {
              currentActive = NAV_LINKS[0].id;
            }
          }

          if (currentActive) {
            setActive(currentActive);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="site-header">
      <button className="brand-link" type="button" onClick={goTop}>
        <img
          className="brand-logo"
          width={56}
          height={56}
          src="/images/NCWENLogo.png"
          alt="NCWEN logo"
        />
        <span className="brand">{t.brand}</span>
      </button>

      <button
        className={`nav-toggle ${open ? "is-open" : ""}`}
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
      </button>

      <nav className={`site-nav ${open ? "is-open" : ""}`}>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                className={`nav-link ${active === link.id ? "is-active" : ""}`}
                onClick={() => goTo(link.id)}
              >
                {t.nav[link.key]}
              </button>
            </li>
          ))}
          <li>
            <Button
              variant="gold"
              onClick={() => {
                setOpen(false);
                onContact();
              }}
            >
              {t.contactTitle}
            </Button>
          </li>
        </ul>

        <div className="nav-actions">
          {/* <Button variant="gold" onClick={() => goTo("cta")}> */}
          {/*   {t.nav.apply} */}
          {/* </Button> */}
          <div className="lang-switch" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${lang === "tr" ? "is-active" : ""}`}
              onClick={() => setLang("tr")}
            >
              TR
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <button
          className="nav-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
