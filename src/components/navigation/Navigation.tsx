import { useEffect, useState } from "react";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

const NAV_LINKS = [
  { id: "coach", key: "coach" },
  { id: "pillars", key: "pillars" },
  { id: "publications", key: "publications" },
  { id: "events", key: "events" },
] as const;

export default function Navigation({
  lang,
  setLang,
}: {
  setLang: (str: Language) => void;
  lang: Language;
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
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
        </ul>

        <div className="nav-actions">
          <Button variant="gold" onClick={() => goTo("cta")}>
            {t.nav.apply}
          </Button>
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
