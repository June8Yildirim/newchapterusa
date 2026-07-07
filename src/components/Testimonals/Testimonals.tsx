import { useRef, useState } from "react";
import { testimonals } from "../../constants/testimonals";
import "./testimonal.css";
import TestimonialItem from "./TestimonalItem";

export default function TestimonialsCarousel({
  setOpenTestimonal,
}: {
  setOpenTestimonal: (test: (typeof testimonals)[number]) => void;
}) {
  const [index, setIndex] = useState(0);
  const total = testimonals.length;
  const visibleCount = 2;
  const maxIndex = Math.max(0, total - visibleCount);

  const goTo = (i: number) => {
    setIndex(Math.min(Math.max(i, 0), maxIndex));
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

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
        <div className="testimonial-carousel">
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
