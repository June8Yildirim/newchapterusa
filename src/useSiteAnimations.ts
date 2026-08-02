import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll-driven reveal animations for the landing page.
 * Everything is gated behind `prefers-reduced-motion: no-preference`, so
 * users who opt out simply see the fully rendered page with no motion.
 *
 * Every tween uses `clearProps` so GSAP removes the inline transform/opacity
 * it writes once the animation finishes — otherwise those inline styles linger
 * and (a) shift elements and (b) override CSS `:hover` transforms.
 */
export function useSiteAnimations(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header slides down
        gsap.from(".site-header .brand, .header-nav > *", {
          y: -18,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          clearProps: "all",
        });

        // Hero content rises in on load
        gsap.from(".hero-inner > *", {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.15,
          clearProps: "all",
        });

        // Every section heading reveals as it scrolls into view.
        // `start: "top bottom"` fires the instant the heading enters the
        // viewport, so short sections at the very bottom of the page (which
        // can never scroll high enough to hit a "top 85%" trigger) still
        // reveal instead of staying stuck at opacity: 0.
        gsap.utils.toArray<HTMLElement>(".section h2").forEach((heading) => {
          gsap.from(heading, {
            scrollTrigger: { trigger: heading, start: "top bottom" },
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all",
          });
        });

        // Card grids stagger their children in
        [
          ".pub-grid",
          ".announcement-list",
          ".happening-track",
          ".pillar-grid",
          ".testimonial-grid",
        ].forEach((sel) => {
          const grid = scope.current?.querySelector(sel);
          if (!grid) return;
          gsap.from(grid.children, {
            scrollTrigger: { trigger: grid, start: "top 80%" },
            y: 44,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
            clearProps: "all",
          });
        });

        // Credentials list wipes in from the left
        const creds = scope.current?.querySelector(".credentials");
        if (creds) {
          gsap.from(creds.children, {
            scrollTrigger: { trigger: creds, start: "top 85%" },
            x: -24,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "all",
          });
        }

        // Coach photo scales up gently
        const photo = scope.current?.querySelector(".photo-placeholder");
        if (photo) {
          gsap.from(photo, {
            scrollTrigger: { trigger: photo, start: "top 85%" },
            scale: 0.92,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all",
          });
        }
      });
    },
    { scope },
  );
}
