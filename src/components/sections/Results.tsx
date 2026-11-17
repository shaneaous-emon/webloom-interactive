"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { results } from "@/lib/content";
import { SplitHeading, useRevealAll } from "@/components/ui/primitives";

export function Results() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat").forEach((el, i) => {
        const num = el.querySelector<HTMLElement>(".stat__num b")!;
        const target = Number(el.dataset.value);
        const decimals = Number(el.dataset.decimals);
        const obj = { v: 0 };
        const ring = el.querySelector<SVGCircleElement>(".stat__ring-fg");
        const len = ring?.getTotalLength() ?? 0;
        if (ring) gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true }, delay: i * 0.12 });
        tl.to(obj, {
          v: target,
          duration: 2,
          ease: "expo.out",
          onUpdate: () => {
            num.textContent = obj.v.toFixed(decimals);
          },
        });
        if (ring) tl.to(ring, { strokeDashoffset: len * (1 - [0.42, 0.68, 0.28][i]), duration: 2, ease: "expo.out" }, 0);
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="results section theme-light">
      <div className="wrap">
        <div className="results__head">
          <div>
            <p className="label mono" data-reveal>
              {results.label}
            </p>
            <SplitHeading className="h2" lines={[results.title[0], { text: results.title[1], accent: true }]} />
          </div>
          <div className="results__intro" data-reveal>
            {results.intro.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="results__note mono">{results.note}</p>
          </div>
        </div>
        <div className="stats">
          {results.stats.map((s) => (
            <div key={s.label} className="stat" data-value={s.value} data-decimals={s.decimals} data-reveal>
              <svg className="stat__ring" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="54" className="stat__ring-bg" />
                <circle cx="60" cy="60" r="54" className="stat__ring-fg" />
              </svg>
              <p className="stat__num" aria-label={`${s.prefix}${s.value}${s.suffix}`}>
                <span>{s.prefix}</span>
                <b>0</b>
                <span>{s.suffix}</span>
              </p>
              <p className="stat__label mono">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
