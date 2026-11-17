"use client";

import { useCallback, useEffect, useRef } from "react";
import { createTimeline, svg, stagger, type Timeline } from "animejs";

/** A single line that grows into a connected system. */
const NODES = [
  [60, 160], [150, 80], [150, 240], [260, 160], [360, 70], [360, 250], [460, 160], [540, 90], [540, 230],
];
const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [6, 8], [1, 4], [2, 5],
];

export default function AnimeLab({ paused }: { paused: boolean }) {
  const root = useRef<SVGSVGElement>(null);
  const tl = useRef<Timeline | null>(null);

  const play = useCallback(() => {
    if (!root.current) return;
    tl.current?.revert();
    const q = (s: string) => root.current!.querySelectorAll(s);
    const t = createTimeline({ defaults: { ease: "inOutExpo" } });
    t.add(svg.createDrawable(q(".a-spine")), { draw: ["0 0", "0 1"], duration: 1400 })
      .add(q(".a-node"), { scale: [0, 1], opacity: [0, 1], duration: 700, delay: stagger(70), ease: "outBack(3)" }, "-=700")
      .add(svg.createDrawable(q(".a-edge")), { draw: ["0 0", "0 1"], duration: 900, delay: stagger(60) }, "-=600")
      .add(q(".a-pulse"), { opacity: [0, 1, 0], scale: [0.4, 2.4], duration: 1200, delay: stagger(90, { from: "center" }), ease: "outQuad" }, "-=500");
    if (paused) t.seek(t.duration);
    tl.current = t;
  }, [paused]);

  useEffect(() => {
    play();
    return () => {
      tl.current?.revert();
    };
  }, [play]);

  return (
    <div className="lab lab--anime">
      <svg ref={root} viewBox="0 0 600 320" className="a-svg" aria-hidden="true">
        <path className="a-spine" d="M20 300 C 160 300, 120 160, 300 160 S 460 20, 580 20" />
        {EDGES.map(([a, b], i) => (
          <line key={i} className="a-edge" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
        {NODES.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle className="a-pulse" r="10" />
            <circle className={`a-node ${i === 3 || i === 6 ? "is-accent" : ""}`} r={i === 3 || i === 6 ? 9 : 6} />
          </g>
        ))}
      </svg>
      <div className="lab__control">
        <span className="mono">Sequence</span>
        <button type="button" className="lab__btn" onClick={play}>
          ↻ Replay
        </button>
      </div>
    </div>
  );
}
