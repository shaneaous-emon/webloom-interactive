"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AppCtx = {
  /** user toggled "pause motion" or prefers reduced motion */
  paused: boolean;
  togglePaused: () => void;
  reduced: boolean;
  /** true once the intro loader has finished */
  introDone: boolean;
  setIntroDone: (v: boolean) => void;
  introKey: number;
  replayIntro: () => void;
  getLenis: () => Lenis | null;
  scrollTo: (target: string | number | HTMLElement) => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside <AppProvider>");
  return c;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Lenis smooth scroll, synced with GSAP's ticker + ScrollTrigger
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      anchors: { offset: -80 },
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Lock scroll while the intro plays
  useEffect(() => {
    const l = lenisRef.current;
    document.documentElement.classList.toggle("is-loading", !introDone);
    if (!l) return;
    if (introDone) l.start();
    else l.stop();
  }, [introDone]);

  // Reset scroll on route change and recalculate triggers
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", paused || reduced);
  }, [paused, reduced]);

  const togglePaused = useCallback(() => setPaused((p) => !p), []);
  const replayIntro = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    setIntroDone(false);
    setIntroKey((k) => k + 1);
  }, []);
  const getLenis = useCallback(() => lenisRef.current, []);
  const scrollTo = useCallback((target: string | number | HTMLElement) => {
    const l = lenisRef.current;
    if (l) l.scrollTo(target, { offset: 0, duration: 1.4 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <Ctx.Provider
      value={{
        paused: paused || reduced,
        togglePaused,
        reduced,
        introDone,
        setIntroDone,
        introKey,
        replayIntro,
        getLenis,
        scrollTo,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
