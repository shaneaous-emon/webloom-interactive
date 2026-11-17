"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { services } from "@/lib/content";
import { SplitHeading, Arrow } from "@/components/ui/primitives";

export function ServiceVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="viz viz--windows" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="viz-win" style={{ ["--i" as string]: i }}>
            <div className="viz-win__bar">
              <i /><i /><i />
            </div>
            <div className="viz-win__body">
              <span className="l1" />
              <span className="l2" />
              <span className="blk" />
            </div>
          </div>
        ))}
      </div>
    );
  if (index === 1)
    return (
      <div className="viz viz--cube" aria-hidden="true">
        <div className="cube">
          {["front", "back", "right", "left", "top", "bottom"].map((f) => (
            <span key={f} className={`cube__f cube__f--${f}`} />
          ))}
        </div>
        <span className="orbit orbit--a" />
        <span className="orbit orbit--b" />
      </div>
    );
  if (index === 2)
    return (
      <div className="viz viz--curve" aria-hidden="true">
        <svg viewBox="0 0 300 200">
          <path className="grid" d="M0 50H300M0 100H300M0 150H300M75 0V200M150 0V200M225 0V200" />
          <path id="ease-path" className="curve" d="M20 180 C 120 180, 140 20, 280 20" />
          <circle r="7" className="runner">
            <animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.75;1" calcMode="spline" keySplines="0.16 1 0.3 1; 0 0 1 1">
              <mpath href="#ease-path" />
            </animateMotion>
          </circle>
          <circle cx="20" cy="180" r="4" className="node" />
          <circle cx="280" cy="20" r="4" className="node" />
        </svg>
      </div>
    );
  return (
    <div className="viz viz--grow" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ ["--d" as string]: `${(i % 4) * 0.12 + Math.floor(i / 4) * 0.18}s`, ["--h" as string]: `${30 + ((i * 37) % 70)}%` }} />
      ))}
    </div>
  );
}

export function Services() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = ref.current!.querySelector<HTMLElement>(".services__track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".services__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(".services__bar i", { scaleX: self.progress });
              const idx = Math.min(4, Math.max(1, Math.ceil(self.progress * 4.4)));
              const el = ref.current?.querySelector(".services__count b");
              if (el) el.textContent = String(idx).padStart(2, "0");
            },
          },
        });
        gsap.utils.toArray<HTMLElement>(".svc-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".viz"),
            { rotateY: -25, scale: 0.85 },
            {
              rotateY: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "center center", scrub: true },
            }
          );
        });
      });
      mm.add("(max-width: 899px)", () => {
        gsap.utils.toArray<HTMLElement>(".svc-card").forEach((card) => {
          gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 90%", once: true } });
        });
      });
    },
    { scope: ref }
  );

  // 3D tilt on hover
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 8}deg`);
    el.style.setProperty("--ry", `${x * 10}deg`);
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <section ref={ref} className="services" id="expertise">
      <div className="services__pin">
        <div className="services__track">
          <div className="svc-intro">
            <p className="label mono">{services.label}</p>
            <SplitHeading className="h2" lines={[services.title[0], { text: services.title[1], accent: true }]} />
            <div className="svc-intro__copy">
              {services.intro.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <p className="svc-intro__hint mono">
              {services.hint} <Arrow />
            </p>
          </div>
          {services.items.map((s, i) => (
            <article key={s.num} className="svc-card" onPointerMove={onMove} onPointerLeave={onLeave}>
              <div className="svc-card__inner">
                <div className="svc-card__head">
                  <span className="svc-card__num mono">{s.num}</span>
                  <span className="svc-card__arrow">
                    <Arrow />
                  </span>
                </div>
                <ServiceVisual index={i} />
                <h3 className="svc-card__title">
                  {s.title[0]}
                  <br />
                  <em>{s.title[1]}</em>
                </h3>
                <p className="svc-card__body">{s.body}</p>
                <ul className="svc-card__tags">
                  {s.tags.map((t) => (
                    <li key={t} className="mono">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="services__progress wrap mono" aria-hidden="true">
          <span className="services__count">
            <b>01</b> — 04
          </span>
          <span className="services__bar">
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}
