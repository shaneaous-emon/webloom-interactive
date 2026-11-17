"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

let firstRender = true;

/** Coral curtain that lifts off each newly navigated page. */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = curtain.current;
    if (!el) return;
    if (firstRender) {
      firstRender = false;
      gsap.set(el, { display: "none" });
      return;
    }
    const tl = gsap.timeline();
    tl.set(el, { display: "block", clipPath: "inset(0% 0% 0% 0%)" })
      .fromTo(el.querySelector(".curtain__mark"), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 0.4, ease: "power2.in" }, 0.1)
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, 0.2)
      .set(el, { display: "none" });
    return () => {
      tl.kill();
    };
  }, []);
  return (
    <>
      <div ref={curtain} className="curtain" aria-hidden="true">
        <span className="curtain__mark">✳</span>
      </div>
      {children}
    </>
  );
}
