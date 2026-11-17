"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cta } from "@/lib/content";
import { PillLink, useRevealAll } from "@/components/ui/primitives";

/** Letters swell in weight as the cursor passes over them. */
export function CTA() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>(".cta__ch");
      gsap.fromTo(
        letters,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.025, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".cta__title", start: "top 85%", once: true } }
      );
      gsap.to(".cta__star", { rotate: 360, duration: 14, ease: "none", repeat: -1 });
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const setters = letters.map((el) => ({ el, set: gsap.quickTo(el, "--w", { duration: 0.5, ease: "power3" }) }));
      const move = (e: PointerEvent) => {
        setters.forEach(({ el, set }) => {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          set(gsap.utils.mapRange(0, 320, 900, 300, Math.min(d, 320)));
        });
      };
      const leave = () => setters.forEach(({ set }) => set(500));
      const el = ref.current!;
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="cta section">
      <div className="cta__glow" aria-hidden="true" />
      <div className="wrap">
        <div className="cta__top" data-reveal>
          <p className="mono">{cta.label}</p>
          <p className="mono cta__ears">{cta.ears}</p>
        </div>
        <span className="cta__star" aria-hidden="true">
          ✳
        </span>
        <h2 className="cta__title" aria-label={cta.title.join(" ")}>
          {cta.title.map((line, li) => (
            <span key={line} className={`cta__line ${li ? "is-accent" : ""}`} aria-hidden="true">
              {line.split("").map((c, i) => (
                <span key={i} className="cta__ch">
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <div className="cta__foot">
          <p data-reveal>{cta.body}</p>
          <div data-reveal>
            <PillLink href="/contact">{cta.button}</PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
