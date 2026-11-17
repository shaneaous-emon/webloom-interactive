"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function GsapLab({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const auto = useRef<gsap.core.Tween | null>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const t = gsap.timeline({ paused: true, defaults: { ease: "expo.inOut", duration: 1 } });
      t.from(".g-line", { scaleX: 0, stagger: 0.08, transformOrigin: "left center" })
        .from(".g-circle", { scale: 0, rotate: -180, ease: "back.out(2)" }, 0.2)
        .to(".g-square", { rotate: 225, x: "-120%", borderRadius: "50%" }, 0.5)
        .from(".g-tri", { yPercent: 160, opacity: 0, stagger: 0.1 }, 0.6)
        .to(".g-circle", { x: "140%", scale: 0.6, backgroundColor: "#F1F2F3" }, 1.2)
        .to(".g-square", { y: "-60%", scale: 1.4 }, 1.4)
        .to(".g-dot", { scale: 1, stagger: { each: 0.03, from: "center", grid: [5, 9] }, ease: "back.out(3)", duration: 0.6 }, 1.2)
        .to(".g-word span", { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.8 }, 1.6);
      tl.current = t;
      const proxy = { p: 0 };
      if (!paused) {
        auto.current = gsap.to(proxy, {
          p: 1,
          duration: 3.2,
          delay: 0.3,
          ease: "power1.inOut",
          onUpdate: () => {
            t.progress(proxy.p);
            setProgress(proxy.p);
          },
        });
      } else {
        t.progress(1);
        setProgress(1);
      }
    },
    { scope: ref }
  );

  const scrub = (v: number) => {
    auto.current?.kill();
    setProgress(v);
    tl.current && gsap.to(tl.current, { progress: v, duration: 0.6, ease: "power3.out", overwrite: true });
  };

  return (
    <div ref={ref} className="lab lab--gsap">
      <div className="g-stage">
        <div className="g-lines">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="g-line" />
          ))}
        </div>
        <div className="g-dots">
          {Array.from({ length: 45 }).map((_, i) => (
            <i key={i} className="g-dot" />
          ))}
        </div>
        <span className="g-circle" />
        <span className="g-square" />
        <span className="g-tri" />
        <span className="g-tri g-tri--2" />
        <p className="g-word" aria-hidden="true">
          {"Choreography".split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </p>
      </div>
      <label className="lab__control">
        <span className="mono">Timeline</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => scrub(Number(e.target.value))}
          aria-label="Scrub the animation timeline"
        />
        <output className="mono">{(progress * 2.4).toFixed(2)}s</output>
      </label>
    </div>
  );
}
