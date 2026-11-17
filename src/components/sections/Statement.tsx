"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { statement, stack } from "@/lib/content";
import { useApp } from "@/components/providers/AppProvider";

/** Apple-style scroll-filled statement: each word lights up as you scroll. */
export function Statement() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".fill-word");
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".statement__text", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.fromTo(
        ".statement__sub span",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".statement__sub", start: "top 90%", once: true },
        }
      );
      gsap.fromTo(".statement__orb", { yPercent: -20 }, { yPercent: 30, ease: "none", scrollTrigger: { trigger: ref.current, scrub: true } });
    },
    { scope: ref }
  );

  const accentWords = new Set(["stop,", "explore,", "feel"]);
  return (
    <section ref={ref} id="statement" className="statement section">
      <div className="statement__orb" aria-hidden="true" />
      <div className="wrap">
        <p className="label mono">{statement.label}</p>
        <p className="statement__text">
          {statement.text.split(" ").map((w, i) => (
            <span key={i} className={`fill-word ${accentWords.has(w) ? "is-accent" : ""}`}>
              {w}{" "}
            </span>
          ))}
        </p>
        <p className="statement__sub">
          {statement.sub.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </p>
      </div>
    </section>
  );
}

/** Velocity-reactive marquee of the stack. */
export function StackMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { getLenis, paused } = useApp();
  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".marquee__track");
      const tweens = rows.map((row, i) =>
        gsap.to(row, { xPercent: i % 2 ? 0 : -50, startAt: { xPercent: i % 2 ? -50 : 0 }, duration: 38, ease: "none", repeat: -1 })
      );
      let boost = 0;
      const tick = () => {
        const v = getLenis()?.velocity ?? 0;
        boost += (Math.min(Math.abs(v) * 0.25, 5) - boost) * 0.08;
        tweens.forEach((t) => t.timeScale(paused ? 0 : 1 + boost));
        gsap.set(".marquee__track", { skewX: gsap.utils.clamp(-8, 8, -v * 0.35) });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref, dependencies: [paused] }
  );
  const items = [...stack, ...stack];
  return (
    <div ref={ref} className="marquee" aria-label={`Built with ${stack.join(", ")}`}>
      {[0, 1].map((r) => (
        <div key={r} className={`marquee__row ${r ? "is-outline" : ""}`} aria-hidden="true">
          <div className="marquee__track">
            {items.map((s, i) => (
              <span key={i} className="marquee__item">
                {s}
                <i>✳</i>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
