"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useApp } from "@/components/providers/AppProvider";
import { LogoMark } from "@/components/ui/Logo";

const SEEN_KEY = "webloom:intro-seen";

export function Preloader() {
  const { setIntroDone, introKey, reduced } = useApp();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    // Skip on repeat visits in the same session (unless replayed) and for reduced motion.
    if ((seen && introKey === 0) || reduced) {
      setActive(false);
      setIntroDone(true);
      return;
    }
    setActive(true);
    setCount(0);
  }, [introKey, reduced, setIntroDone]);

  useEffect(() => {
    if (!active || !root.current) return;
    const el = root.current;
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const path = el.querySelector<SVGPathElement>(".mark-path");
      const len = path?.getTotalLength() ?? 2000;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      gsap.set(".mark-dot", { scale: 0, transformOrigin: "center" });
      gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {}
          setActive(false);
        },
      });
      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => setCount(Math.round(counter.v)),
      })
        .to(path, { strokeDashoffset: 0, duration: 1.9, ease: "power2.inOut" }, 0)
        .to(".loader__bar i", { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0)
        .to(path, { fillOpacity: 1, duration: 0.5 }, 1.6)
        .to(".mark-dot", { scale: 1, duration: 0.6, ease: "back.out(3)" }, 1.8)
        .add(() => setIntroDone(true), 2.45)
        .to(".loader__inner", { yPercent: -30, opacity: 0, duration: 0.8, ease: "expo.in" }, 2.4)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, 2.6);
    }, el);
    return () => ctx.revert();
  }, [active, setIntroDone]);

  if (!active) return null;
  return (
    <div ref={root} className="loader" role="status" aria-label="Loading Webloom Interactive">
      <div className="loader__inner">
        <LogoMark className="loader__mark" stroke />
        <div className="loader__meta">
          <span>Webloom Interactive</span>
          <span className="loader__count">{String(count).padStart(3, "0")}</span>
        </div>
        <div className="loader__bar">
          <i />
        </div>
        <p className="loader__tag">Design × Technology × Feeling</p>
      </div>
    </div>
  );
}
