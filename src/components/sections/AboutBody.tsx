"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { about } from "@/lib/content";
import { SplitHeading, Section } from "@/components/ui/primitives";
import { LogoMark } from "@/components/ui/Logo";

export function AboutBody() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".fill-word");
      gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".about__belief", start: "top 80%", end: "bottom 50%", scrub: true } });
      gsap.fromTo(".about__orbit", { rotate: -40 }, { rotate: 40, ease: "none", scrollTrigger: { trigger: ".about__found", scrub: true } });
    },
    { scope: ref }
  );
  return (
    <div ref={ref}>
      <Section className="about__belief-wrap">
        <div className="wrap">
          <p className="about__belief statement__text">
            {about.belief.split(" ").map((w, i) => (
              <span key={i} className={`fill-word ${/creative|precision/.test(w) ? "is-accent" : ""}`}>
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </Section>
      <Section className="about__found" theme="light">
        <div className="wrap about__grid">
          <div>
            <SplitHeading className="h2" lines={[about.foundation.title[0], { text: about.foundation.title[1], accent: true }]} />
            <p className="about__found-body" data-reveal>
              {about.foundation.body}
            </p>
          </div>
          <div className="about__badge" data-reveal>
            <svg className="about__orbit" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="190" />
              <circle cx="200" cy="200" r="140" strokeDasharray="4 8" />
              <circle cx="200" cy="10" r="8" className="dot" />
              <circle cx="60" cy="200" r="5" className="dot dot--dark" />
            </svg>
            <LogoMark className="about__mark" />
            <span className="mono about__badge-label">{about.foundation.badge}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}
