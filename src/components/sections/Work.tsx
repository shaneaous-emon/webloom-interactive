"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { projects, workSection, type Project } from "@/lib/content";
import { SplitHeading, PillLink, Arrow, useRevealAll } from "@/components/ui/primitives";

function Screen({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <div className={`screen ${className}`}>
      <Image src={p.image} alt="" fill sizes="(max-width: 900px) 90vw, 60vw" className="screen__img" />
      <div className="screen__ui">
        <div className="screen__nav mono">
          <b>{p.name.toUpperCase()}.</b>
          <span>Explore ↗</span>
        </div>
        <p className="screen__headline">
          {p.tagline[0]}
          <br />
          {p.tagline[1]}
        </p>
        <span className="screen__sector mono">{p.sector}</span>
      </div>
    </div>
  );
}

/** Videinfra-inspired: a 3D laptop that tilts open as you scroll and cycles through concepts. */
export function WorkShowcase() {
  const ref = useRef<HTMLElement>(null);
  const shown = projects.slice(0, 2);
  const [active, setActive] = useState(0);
  useRevealAll(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".device-scene",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => setActive(self.progress > 0.58 ? 1 : 0),
          },
        });
        tl.fromTo(".device", { rotateX: 58, scale: 0.72, yPercent: 14 }, { rotateX: 0, scale: 1, yPercent: 0, ease: "power2.out", duration: 3 })
          .fromTo(".device__glow", { opacity: 0 }, { opacity: 1, duration: 2 }, 0.5)
          .fromTo(".screen--1", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "expo.inOut", duration: 2 }, 5)
          .fromTo(".screen--0 .screen__img", { scale: 1 }, { scale: 1.15, duration: 2 }, 5)
          .to({}, { duration: 1 });
      });
      mm.add("(max-width: 899px)", () => {
        gsap.set(".device", { rotateX: 0, scale: 1 });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="work section" id="work">
      <div className="wrap work__head">
        <div>
          <p className="label mono" data-reveal>
            {workSection.label}
          </p>
          <SplitHeading className="h2" lines={[workSection.title[0], { text: workSection.title[1], accent: true }]} />
        </div>
        <div className="work__intro" data-reveal>
          {workSection.intro.map((l) => (
            <p key={l}>{l}</p>
          ))}
          <PillLink href="/work" variant="ghost">
            {workSection.cta}
          </PillLink>
        </div>
      </div>

      <div className="device-scene">
        <div className="device-sticky">
          <div className="device-stage">
            <span className="device__glow" aria-hidden="true" />
            <div className="device">
              <div className="device__lid">
                <Link href={`/work/${shown[active].slug}`} className="device__screen" data-cursor="view" aria-label={`Explore ${shown[active].name}`}>
                  {shown.map((p, i) => (
                    <Screen key={p.slug} p={p} className={`screen--${i}`} />
                  ))}
                </Link>
              </div>
              <div className="device__base" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>

          <div className="device-info wrap">
            {shown.map((p, i) => (
              <div key={p.slug} className={`device-info__item ${active === i ? "is-active" : ""}`} aria-hidden={active !== i}>
                <span className="mono">{p.index}</span>
                <h3>{p.name}</h3>
                <p className="mono">
                  {p.type} · {p.year}
                </p>
                <Link href={`/work/${p.slug}`} className="device-info__link mono" tabIndex={active === i ? 0 : -1}>
                  Explore <Arrow />
                </Link>
              </div>
            ))}
            <div className="device-info__dots" aria-hidden="true">
              {shown.map((p, i) => (
                <i key={p.slug} className={active === i ? "is-active" : ""} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Card used on the Work index page. */
export function ProjectCard({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        ".pcard__img",
        { yPercent: -8, scale: 1.15 },
        { yPercent: 8, scale: 1.15, ease: "none", scrollTrigger: { trigger: ref.current, scrub: true } }
      );
      gsap.fromTo(
        ".pcard__media",
        { clipPath: "inset(18% 8% 18% 8% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "expo.out", duration: 1.6, scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } }
      );
    },
    { scope: ref }
  );
  return (
    <Link ref={ref} href={`/work/${p.slug}`} className={`pcard ${index % 2 ? "is-alt" : ""}`} data-cursor="view">
      <div className="pcard__media">
        <Image src={p.image} alt={`${p.name} studio concept`} fill sizes="(max-width: 900px) 100vw, 60vw" className="pcard__img" />
        <div className="pcard__overlay">
          <span className="pcard__brand">{p.name.toUpperCase()}.</span>
          <span className="mono">Explore ↗</span>
        </div>
        <p className="pcard__tagline">
          {p.tagline[0]}
          <br />
          {p.tagline[1]}
        </p>
      </div>
      <div className="pcard__meta">
        <span className="mono">{p.sector}</span>
        <span className="mono">{p.index}</span>
        <h3>{p.name}</h3>
        <span className="mono">
          {p.type} · {p.year}
        </span>
      </div>
    </Link>
  );
}
