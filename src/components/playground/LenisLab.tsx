"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

/** A framed, layered landscape with its own Lenis instance. */
export default function LenisLab() {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [lerp, setLerp] = useState(0.08);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    if (!wrapper.current || !content.current) return;
    const lenis = new Lenis({ wrapper: wrapper.current, content: content.current, lerp, smoothWheel: true, autoRaf: true });
    const layers = content.current.querySelectorAll<HTMLElement>("[data-depth]");
    lenis.on("scroll", (l: Lenis) => {
      const p = l.progress || 0;
      setProg(p);
      layers.forEach((el) => {
        const d = Number(el.dataset.depth);
        el.style.transform = `translate3d(0, ${l.scroll * d}px, 0)`;
      });
    });
    return () => lenis.destroy();
  }, [lerp]);

  return (
    <div className="lab lab--lenis">
      <div ref={wrapper} className="l-frame" data-lenis-prevent tabIndex={0} aria-label="Scrollable landscape">
        <div ref={content} className="l-content">
          <div className="l-sky">
            <span className="l-sun" data-depth="0.7" />
            <svg className="l-layer" data-depth="0.55" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 220 L80 140 L150 190 L230 90 L320 180 L400 110 L480 170 L600 100 V300 H0Z" fill="#454F54" opacity="0.55" />
            </svg>
            <svg className="l-layer" data-depth="0.35" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 250 L60 200 L140 240 L210 170 L300 230 L380 160 L470 220 L540 180 L600 210 V300 H0Z" fill="#2b3135" />
            </svg>
            <svg className="l-layer" data-depth="0.15" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 280 C100 230 160 290 260 250 S420 220 600 270 V300 H0Z" fill="#1d2124" />
            </svg>
          </div>
          {["Glide", "Ease", "Drift", "Settle"].map((w, i) => (
            <div key={w} className="l-panel">
              <span className="mono">0{i + 1}</span>
              <p>{w}</p>
            </div>
          ))}
          <div className="l-end mono">↑ Smooth all the way back</div>
        </div>
      </div>
      <div className="l-progress" aria-hidden="true">
        <i style={{ transform: `scaleY(${prog})` }} />
      </div>
      <label className="lab__control">
        <span className="mono">Smoothing</span>
        <input
          type="range"
          min={0.02}
          max={0.3}
          step={0.01}
          value={0.32 - lerp}
          onChange={(e) => setLerp(Number((0.32 - Number(e.target.value)).toFixed(2)))}
          aria-label="Adjust scroll smoothing"
        />
        <output className="mono">{Math.round((0.32 - lerp) * 333)}%</output>
      </label>
    </div>
  );
}
