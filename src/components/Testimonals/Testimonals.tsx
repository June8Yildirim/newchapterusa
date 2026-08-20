import { useEffect, useRef, useState } from "react";
import { testimonals } from "../../constants/testimonals";
import "./testimonal.css";
import TestimonialItem from "./TestimonalItem";
import { TRANSLATIONS, type Language } from "../../constants/text";

export default function TestimonialsCarousel({
  lang,
  setOpenTestimonal,
}: {
  lang: Language;
  setOpenTestimonal: (test: (typeof testimonals)[number]) => void;
}) {
  const t = TRANSLATIONS[lang];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonals.length;
  const visibleCount = 2;
  const maxIndex = Math.max(0, total - visibleCount);

  const goTo = (i: number) => {
    setIndex(Math.min(Math.max(i, 0), maxIndex));
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Auto-advance every 5s, looping back to the start; paused on hover.
  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [paused, maxIndex]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
  };

  return (
    <section className="section testimonials">
      {/* Testimonials */}
      <div className="container">
        <div className="section-header">
          <h2>{t.testimonials.testimonialsTitle}</h2>
        </div>
        <div
          className="testimonial-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            className="carousel-arrow prev"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous testimonial"
          >
            ‹
          </button>

          <div
            className="testimonial-viewport"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="testimonial-track"
              style={{
                transform: `translateX(-${index * (100 / visibleCount)}%)`,
              }}
            >
              {testimonals.map((test) => (
                <TestimonialItem
                  name={test.name}
                  job={test.job}
                  significant={test.significant}
                  onClick={() => setOpenTestimonal(test)}
                  key={test.name}
                />
              ))}
            </div>
          </div>

          <button
            className="carousel-arrow next"
            onClick={next}
            disabled={index === maxIndex}
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        <div className="carousel-dots" role="tablist">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
