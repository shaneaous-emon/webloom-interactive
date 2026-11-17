"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { footer, nav, stack } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { RollText } from "@/components/ui/primitives";
import { useApp } from "@/components/providers/AppProvider";

export function Footer() {
  const { scrollTo, replayIntro } = useApp();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ftr__giant svg",
        { yPercent: 60, scale: 0.92 },
        {
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <footer ref={ref} className="ftr">
      <div className="ftr__top">
        <p className="ftr__concern">
          <span className="eyebrow__dot" aria-hidden="true" />
          {footer.concern}
        </p>
        <button type="button" className="ftr__back mono" onClick={() => scrollTo(0)}>
          <RollText>{footer.back}</RollText> <span aria-hidden="true">↑</span>
        </button>
      </div>

      <div className="ftr__grid">
        <nav className="ftr__nav" aria-label="Footer">
          {[...nav, { label: "Contact", href: "/contact", num: "04" }].map((n) => (
            <Link key={n.href} href={n.href} className="ftr__link">
              <sup>{n.num}</sup>
              <RollText>{n.label}</RollText>
            </Link>
          ))}
        </nav>
        <details className="ftr__built">
          <summary className="mono">
            {footer.built} <span aria-hidden="true">+</span>
          </summary>
          <ul>
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <button type="button" className="mono ftr__replay" onClick={replayIntro}>
            {footer.replay}
          </button>
        </details>
      </div>

      <div className="ftr__giant" aria-hidden="true">
        <Logo />
      </div>

      <div className="ftr__bottom mono">
        <span>{footer.copyright}</span>
        <span>Dhaka ↗ Worldwide</span>
      </div>
    </footer>
  );
}
