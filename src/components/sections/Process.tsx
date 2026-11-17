"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { process, principles } from "@/lib/content";
import { SplitHeading, useRevealAll } from "@/components/ui/primitives";

function StepGlyph({ i }: { i: number }) {
  return (
    <svg className={`glyph glyph--${i}`} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="88" className="glyph__ring" />
      <circle cx="100" cy="100" r="62" className="glyph__ring glyph__ring--dash" />
      {i === 0 && (
        <g className="glyph__spin">
          <circle cx="100" cy="38" r="7" className="glyph__accent" />
          <circle cx="100" cy="100" r="26" className="glyph__line" />
          <path d="M118 118 L150 150" className="glyph__line" />
        </g>
      )}
      {i === 1 && (
        <g className="glyph__spin">
          <rect x="66" y="66" width="68" height="68" className="glyph__line" />
          <rect x="66" y="66" width="68" height="68" className="glyph__line" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="7" className="glyph__accent" />
        </g>
      )}
      {i === 2 && (
        <g className="glyph__spin">
          {Array.from({ length: 8 }).map((_, k) => (
            <path key={k} d="M100 58 L100 80" className="glyph__line" transform={`rotate(${k * 45} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="12" className="glyph__accent" />
        </g>
      )}
      {i === 3 && (
        <g className="glyph__spin">
          <path d="M60 140 L140 60 M140 60 H92 M140 60 V108" className="glyph__line" />
          <circle cx="60" cy="140" r="7" className="glyph__accent" />
        </g>
      )}
    </svg>
  );
}

export function Process() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".step");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector(".step__inner"), {
          scale: 0.9 - (cards.length - i) * 0.01,
          filter: "brightness(0.42) blur(1.5px)",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 18%", scrub: true },
        });
      });
      gsap.fromTo(".process__line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".process__steps", start: "top 60%", end: "bottom 60%", scrub: true } });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="process section">
      <div className="wrap process__grid">
        <div className="process__aside">
          <p className="label mono" data-reveal>
            {process.label}
          </p>
          <SplitHeading className="h2" lines={[process.title[0], { text: process.title[1], accent: true }]} />
          <p className="process__intro" data-reveal>
            {process.intro}
          </p>
          <div className="process__line" aria-hidden="true">
            <i />
          </div>
        </div>
        <ol className="process__steps">
          {process.steps.map((s, i) => (
            <li key={s.num} className="step" style={{ ["--i" as string]: i }}>
              <div className="step__inner">
                <div className="step__top">
                  <span className="mono">
                    {s.num} / {s.name}
                  </span>
                  <span className="step__big" aria-hidden="true">
                    {s.num}
                  </span>
                </div>
                <StepGlyph i={i} />
                <div className="step__text">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Principles({ theme }: { theme?: "light" }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useRevealAll(ref);
  return (
    <section ref={ref} className={`principles section ${theme === "light" ? "theme-light" : ""}`}>
      <div className="wrap principles__head">
        <div>
          <p className="label mono" data-reveal>
            {principles.label}
          </p>
          <SplitHeading className="h2" lines={[principles.title[0], { text: principles.title[1], accent: true }]} />
        </div>
        <p className="mono principles__hint" data-reveal>
          {principles.hint}
        </p>
      </div>
      <div ref={track} className="principles__viewport" data-cursor="drag" data-cursor-label="Drag">
        <motion.div className="principles__track" drag="x" dragConstraints={track} dragElastic={0.12} dragTransition={{ bounceStiffness: 260, bounceDamping: 26 }}>
          {principles.items.map((p, i) => (
            <motion.article
              key={p.num}
              className="principle"
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="principle__num mono">
                {p.num} / Studio principle
              </span>
              <span className="principle__glyph" aria-hidden="true">
                {p.glyph}
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
