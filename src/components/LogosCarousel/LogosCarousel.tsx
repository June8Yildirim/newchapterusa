import { useEffect, useState } from "react";
import "./LogosCarousel.css";
import { TRANSLATIONS, type Language } from "../../constants/text";

const LOGOS = [
  {
    src: "/images/University_of_Roehampton_logo.png",
    name: "University of Roehampton",
  },
  {
    src: "/images/international_rescue_com.webp",
    name: "International Rescue Committee",
  },
  { src: "/images/upwardlyglobal.jpeg", name: "Upwardly Global" },
  { src: "/images/NJOR-NJ.png", name: "New Jersey Office of Refugees" },
  { src: "/images/badge2026Lp.png", name: "Leadership Coach" },
  { src: "/images/coachAcademy.png", name: "Coach Academy" },
  { src: "/images/ICFLogo.svg", name: "International Coaching Federation" },
  { src: "/images/anyAmericaNeedsYou.webp", name: "Any America Needs You" },
  { src: "/images/upliftAcademy.png", name: "Uplift Academy" },
  { src: "/images/montclair-state.webp", name: "Montclair State University" },
  { src: "/images/newChapterUsa.png", name: "New Chapter USA" },
];

export default function LogosCarousel({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i: number) => setIndex((i + LOGOS.length) % LOGOS.length);

  // Auto-advance every 3s, paused on hover/focus.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((v) => (v + 1) % LOGOS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused]);

  const active = LOGOS[index];

  return (
    <section className="section logos">
      <div className="container">
        <div className="section-header">
          <h2>{t.affiliationsTitle}</h2>
          <p className="description">{t.affiliationsSubtitle}</p>
        </div>

        <div
          className="logos-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            className="logos-nav"
            aria-label="Previous logo"
            onClick={() => go(index - 1)}
          >
            ‹
          </button>

          <div className="logos-stage">
            <div
              className="logos-track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {LOGOS.map((logo) => (
                <div className="logos-slide" key={logo.src}>
                  <img className="logos-img" src={logo.src} alt={logo.name} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="logos-nav"
            aria-label="Next logo"
            onClick={() => go(index + 1)}
          >
            ›
          </button>
        </div>

        <p className="logos-caption" key={active.name}>
          {active.name}
        </p>

        <div className="logos-dots">
          {LOGOS.map((logo, i) => (
            <button
              key={logo.src}
              type="button"
              className={`logos-dot ${i === index ? "is-active" : ""}`}
              aria-label={logo.name}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
