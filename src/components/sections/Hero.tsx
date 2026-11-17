"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { hero } from "@/lib/content";
import { PillLink, SplitHeading } from "@/components/ui/primitives";
import { useApp } from "@/components/providers/AppProvider";

const HeroField = dynamic(() => import("@/components/three/HeroField"), { ssr: false });

export function Hero() {
  const { introDone, paused, scrollTo } = useApp();
  const root = useRef<HTMLElement>(null);
  const morph = useRef(0);
  const intro = useRef(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    intro.current = introDone;
  }, [introDone]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
      });
      tl.to(".hero__content", { yPercent: -14, opacity: 0, duration: 0.4 }, 0)
        .to(".hero__frame", { opacity: 0, scale: 1.08, duration: 0.3 }, 0)
        .to(".hero__bar", { opacity: 0, duration: 0.3 }, 0.1)
        .to(".hero__vignette", { opacity: 0.35, duration: 0.5 }, 0.2)
        .to(morph, { current: 1, duration: 0.85 }, 0.1)
        .to({}, { duration: 0.05 });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (!introDone) return;
      gsap.fromTo(
        ".hero [data-in]",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.55 }
      );
      gsap.fromTo(".hero__frame > *", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.4, ease: "expo.out", stagger: 0.08, delay: 0.8 });
    },
    { scope: root, dependencies: [introDone] }
  );

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero__sticky">
        <HeroField morph={morph} intro={intro} paused={pausedRef} />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__frame" aria-hidden="true">
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <span className="hero__frame-label mono">{hero.experiment}</span>
          <span className="hero__frame-hint mono">{hero.hint}</span>
        </div>

        <div className="hero__content wrap">
          <div className="hero__top">
            <p className="eyebrow" data-in>
              <span className="eyebrow__dot" aria-hidden="true" />
              {hero.eyebrow}
            </p>
            <p className="mono hero__loc" data-in>
              Dhaka ↗ Worldwide
            </p>
          </div>

          <SplitHeading
            as="h1"
            className="hero__title"
            play={introDone}
            delay={0.35}
            lines={[...hero.lines, ...hero.accent.map((t) => ({ text: t, accent: true }))]}
          />

          <div className="hero__foot">
            <p className="hero__body" data-in>
              <span className="plus" aria-hidden="true">+</span>
              {hero.body}
            </p>
            <div data-in>
              <PillLink
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#work");
                }}
              >
                {hero.cta}
              </PillLink>
            </div>
          </div>
        </div>

        <div className="hero__bar wrap mono">
          <a
            href="#statement"
            className="hero__scroll"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#statement");
            }}
            data-in
          >
            <span className="hero__scroll-line" aria-hidden="true" />
            {hero.scroll}
          </a>
          <span data-in className="hero__hint-m">{hero.tagline}</span>
          <span data-in className="hero__year">© 2026</span>
        </div>

      </div>
    </section>
  );
}
