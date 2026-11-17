"use client";

import { Fragment, useRef, type ElementType, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------------------------------------------------------- Magnetic */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(pointer: coarse)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
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
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- RollText */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll" aria-label={children}>
      <span className="roll__inner" aria-hidden="true">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- Arrow */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18L18 6M18 6H8.5M18 6v9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

/* ---------------------------------------------------------------- Pill button */
export function PillLink({
  href,
  children,
  variant = "accent",
  onClick,
}: {
  href: string;
  children: string;
  variant?: "accent" | "ghost" | "light";
  onClick?: (e: React.MouseEvent) => void;
}) {
  const internal = href.startsWith("/");
  const inner = (
    <>
      <span className="pill__fill" aria-hidden="true" />
      <RollText>{children}</RollText>
      <span className="pill__icon">
        <Arrow />
      </span>
    </>
  );
  return (
    <Magnetic strength={0.25}>
      {internal ? (
        <Link href={href} className={`pill pill--${variant}`} onClick={onClick} data-cursor="hide">
          {inner}
        </Link>
      ) : (
        <a href={href} className={`pill pill--${variant}`} onClick={onClick} data-cursor="hide">
          {inner}
        </a>
      )}
    </Magnetic>
  );
}

/* ---------------------------------------------------------------- Eyebrow */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`} data-reveal>
      <span className="eyebrow__dot" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- SplitHeading
 * Splits each line into words inside overflow masks and slides them up
 * when scrolled into view (or when `play` flips to true). */
type Line = string | { text: string; accent?: boolean };

export function SplitHeading({
  lines,
  as: Tag = "h2",
  className = "",
  play,
  delay = 0,
  stagger = 0.06,
}: {
  lines: Line[];
  as?: ElementType;
  className?: string;
  play?: boolean;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll(".sw__i");
      if (!words?.length) return;
      if (play === false) {
        gsap.set(words, { yPercent: 110, rotate: 4 });
        return;
      }
      gsap.fromTo(
        words,
        { yPercent: 110, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: play === undefined ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
        }
      );
    },
    { scope: ref, dependencies: [play] }
  );
  const text = lines.map((l) => (typeof l === "string" ? l : l.text)).join(" ");
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text}>
      {lines.map((l, li) => {
        const t = typeof l === "string" ? l : l.text;
        const accent = typeof l !== "string" && l.accent;
        return (
          <span key={li} className={`split__line ${accent ? "is-accent" : ""}`} aria-hidden="true">
            {t.split(" ").map((w, wi, arr) => (
              <Fragment key={wi}>
                <span className="sw">
                  <span className="sw__i">{w}</span>
                </span>
                {wi < arr.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

/* ---------------------------------------------------------------- Reveal
 * Fades + lifts any [data-reveal] children inside the scope on enter. */
export function useRevealAll(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });
    },
    { scope }
  );
}

export function Section({
  id,
  className = "",
  children,
  theme,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  theme?: "light";
}) {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);
  return (
    <section ref={ref} id={id} className={`section ${theme === "light" ? "theme-light" : ""} ${className}`}>
      {children}
    </section>
  );
}
