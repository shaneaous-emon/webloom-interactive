"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { playground, type ToolId } from "@/lib/content";
import { SplitHeading, Arrow, useRevealAll } from "@/components/ui/primitives";
import { useApp } from "@/components/providers/AppProvider";

const loading = () => <div className="lab lab--loading mono">Loading experiment…</div>;
const labs: Record<ToolId, React.ComponentType<{ paused: boolean }>> = {
  three: dynamic(() => import("@/components/playground/ThreeLab"), { ssr: false, loading }),
  gsap: dynamic(() => import("@/components/playground/GsapLab"), { ssr: false, loading }),
  motion: dynamic(() => import("@/components/playground/MotionLab"), { ssr: false, loading }),
  lenis: dynamic(() => import("@/components/playground/LenisLab"), { ssr: false, loading }) as React.ComponentType<{ paused: boolean }>,
  anime: dynamic(() => import("@/components/playground/AnimeLab"), { ssr: false, loading }),
  chart: dynamic(() => import("@/components/playground/ChartLab"), { ssr: false, loading }),
};

export function Playground() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ToolId>("three");
  const { paused } = useApp();
  useRevealAll(ref);
  const tool = playground.tools.find((t) => t.id === active)!;
  const Lab = labs[active];

  return (
    <section ref={ref} className="playground section" id="playground">
      <div className="wrap">
        <div className="pg-head">
          <div>
            <p className="label mono" data-reveal>
              {playground.label}
            </p>
            <SplitHeading className="h2" lines={[playground.title[0], { text: playground.title[1], accent: true }]} />
          </div>
          <div className="pg-head__intro" data-reveal>
            {playground.intro.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>

        <div className="pg" data-reveal>
          <div className="pg__tabs" role="tablist" aria-label="Pick a tool">
            {playground.tools.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active === t.id}
                aria-controls="pg-panel"
                className={`pg__tab ${active === t.id ? "is-active" : ""}`}
                onClick={() => setActive(t.id)}
              >
                {active === t.id && <motion.span layoutId="pg-tab" className="pg__tab-bg" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="pg__tab-num mono">{t.num}</span>
                <span className="pg__tab-name">{t.name}</span>
                <Arrow className="pg__tab-arrow" />
              </button>
            ))}
          </div>

          <div className="pg__panel" id="pg-panel" role="tabpanel">
            <div className="pg__meta">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="pg__kicker mono">
                    <span className="eyebrow__dot" aria-hidden="true" />
                    {tool.kicker}
                  </p>
                  <h3 className="pg__title">{playground.heading}</h3>
                  <p className="pg__sub">{playground.sub}</p>
                  <p className="pg__hint">{tool.hint}</p>
                </motion.div>
              </AnimatePresence>
              <p className="pg__live mono">
                <span className="live-dot" aria-hidden="true" />
                {playground.live} <Arrow />
              </p>
            </div>
            <div className="pg__stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tool.id}
                  className="pg__stage-inner"
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Lab paused={paused} />
                </motion.div>
              </AnimatePresence>
              <span className="pg__corner tl" aria-hidden="true" />
              <span className="pg__corner br" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
