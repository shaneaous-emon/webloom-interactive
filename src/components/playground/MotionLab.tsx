"use client";

import { useRef, useState } from "react";
import { motion, LayoutGroup } from "motion/react";

const layouts = ["Grid", "Stack", "Orbit"] as const;
type Layout = (typeof layouts)[number];

const shapes = [
  { id: "a", kind: "circle" },
  { id: "b", kind: "square" },
  { id: "c", kind: "pill" },
  { id: "d", kind: "circle ring" },
  { id: "e", kind: "square accent" },
  { id: "f", kind: "pill ring" },
];

export default function MotionLab({ paused }: { paused: boolean }) {
  const [layout, setLayout] = useState<Layout>("Grid");
  const bounds = useRef<HTMLDivElement>(null);
  const spring = paused ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 22 };

  return (
    <div className="lab lab--motion">
      <LayoutGroup>
        <div ref={bounds} className={`m-stage is-${layout.toLowerCase()}`}>
          {shapes.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              transition={spring}
              drag
              dragConstraints={bounds}
              dragElastic={0.35}
              dragSnapToOrigin
              whileHover={{ scale: 1.08 }}
              whileDrag={{ scale: 1.18, rotate: 12, zIndex: 5 }}
              className={`m-shape ${s.kind}`}
              style={layout === "Orbit" ? ({ ["--a" as string]: `${(i / shapes.length) * 360}deg` } as React.CSSProperties) : undefined}
              data-cursor="drag"
              data-cursor-label="Drag"
            />
          ))}
        </div>
      </LayoutGroup>
      <div className="lab__control lab__control--seg" role="group" aria-label="Switch layout">
        <span className="mono">Layout</span>
        {layouts.map((l) => (
          <button key={l} type="button" className={`seg ${layout === l ? "is-on" : ""}`} onClick={() => setLayout(l)} aria-pressed={layout === l}>
            {layout === l && <motion.span layoutId="seg-bg" className="seg__bg" transition={spring} />}
            <span>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
