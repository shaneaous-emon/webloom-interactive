"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitHeading } from "@/components/ui/primitives";
import { useApp } from "@/components/providers/AppProvider";

/** Shared hero for inner pages: big split title over a slowly rotating wireframe loom. */
export function PageHero({
  label,
  title,
  body,
  children,
}: {
  label: string;
  title: string[];
  body?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { introDone } = useApp();
  useGSAP(
    () => {
      if (!introDone) return;
      gsap.fromTo(".phero [data-in]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.4 });
      gsap.to(".phero__loom", { yPercent: 25, rotate: 8, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    },
    { scope: ref, dependencies: [introDone] }
  );
  return (
    <section ref={ref} className="phero">
      <svg className="phero__loom" viewBox="0 0 600 600" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <ellipse key={i} cx="300" cy="300" rx={280} ry={40 + i * 14} transform={`rotate(${i * 10} 300 300)`} />
        ))}
      </svg>
      <div className="wrap">
        <p className="eyebrow" data-in>
          <span className="eyebrow__dot" aria-hidden="true" />
          {label}
        </p>
        <SplitHeading as="h1" className="phero__title" play={introDone} delay={0.2} lines={[title[0], { text: title[1], accent: true }]} />
        {body && (
          <p className="phero__body" data-in>
            {body}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
