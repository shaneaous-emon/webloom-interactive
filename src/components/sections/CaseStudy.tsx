"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/lib/content";
import { workPage } from "@/lib/content";
import { SplitHeading, Arrow, useRevealAll } from "@/components/ui/primitives";
import { useApp } from "@/components/providers/AppProvider";

export function CaseStudy({ p, next }: { p: Project; next: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { introDone } = useApp();
  useRevealAll(ref);
  useGSAP(
    () => {
      gsap.fromTo(
        ".cs__media",
        { clipPath: "inset(10% 12% 10% 12% round 32px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ".cs__media-wrap", start: "top 80%", end: "top 10%", scrub: true } }
      );
      gsap.fromTo(".cs__media img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".cs__media-wrap", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".cs__brand", { xPercent: 10 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: ".cs__media-wrap", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".chapter").forEach((c) => {
        gsap.fromTo(c.querySelector(".chapter__num"), { opacity: 0.1 }, { opacity: 1, scrollTrigger: { trigger: c, start: "top 70%", end: "top 30%", scrub: true } });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="cs">
      <section className="phero cs__hero">
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__dot" aria-hidden="true" />
            {p.name} / Studio concept
          </p>
          <SplitHeading as="h1" className="phero__title cs__title" play={introDone} delay={0.2} lines={[p.heroTitle]} />
          <div className="cs__intro">
            <p className="phero__body" data-reveal>
              {p.summary}
            </p>
            <dl className="cs__meta" data-reveal>
              <div>
                <dt className="mono">Type</dt>
                <dd>{p.type}</dd>
              </div>
              <div>
                <dt className="mono">Sector</dt>
                <dd>{p.sector}</dd>
              </div>
              <div>
                <dt className="mono">Year</dt>
                <dd>{p.year}</dd>
              </div>
            </dl>
          </div>
          <p className="mono cs__note" data-reveal>
            {workPage.conceptNote}
          </p>
        </div>
      </section>

      <div className="cs__media-wrap">
        <div className="cs__media">
          <Image src={p.image} alt={`${p.name} concept visual`} fill priority sizes="100vw" />
          <span className="cs__brand" aria-hidden="true">
            {p.name.toUpperCase()}.
          </span>
        </div>
      </div>

      <section className="section cs__chapters">
        <div className="wrap">
          {[
            ["01 / The challenge", "The challenge", p.challenge],
            ["02 / The approach", "The approach", p.approach],
            ["03 / The concept", "The concept", p.concept],
          ].map(([num, title, body]) => (
            <article key={num} className="chapter">
              <span className="chapter__num mono">{num}</span>
              <h2>{title}</h2>
              <p data-reveal>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cs__next">
        <div className="wrap">
          <p className="label mono">Keep exploring</p>
          <Link href={`/work/${next.slug}`} className="next" data-cursor="view" data-cursor-label="Next ↗">
            <span className="next__media">
              <Image src={next.image} alt="" fill sizes="40vw" />
            </span>
            <span className="next__name">{next.name}</span>
            <span className="next__label mono">
              Next concept <Arrow />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
