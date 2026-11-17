"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { nav } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Magnetic, RollText, Arrow } from "@/components/ui/primitives";
import { useApp } from "@/components/providers/AppProvider";

export function Header() {
  const pathname = usePathname();
  const { paused, togglePaused, introDone } = useApp();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!introDone || !headerRef.current) return;
    gsap.fromTo(
      headerRef.current.querySelectorAll(".hdr-in"),
      { yPercent: -120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.3 }
    );
  }, [introDone]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    document.documentElement.classList.toggle("menu-open", open);
    if (open) {
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "circle(0% at calc(100% - 44px) 44px)" }, { clipPath: "circle(150% at calc(100% - 44px) 44px)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll(".menu__link span"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.35 });
    } else {
      gsap.to(el, { clipPath: "circle(0% at calc(100% - 44px) 44px)", duration: 0.6, ease: "expo.inOut", onComplete: () => { gsap.set(el, { display: "none" }); } });
    }
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={`hdr ${hidden && !open ? "is-hidden" : ""} ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/" className="hdr__logo hdr-in" aria-label="Webloom Interactive — home">
          <Logo />
        </Link>
        <nav className="hdr__nav" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`hdr__link hdr-in ${pathname.startsWith(n.href) ? "is-active" : ""}`}
            >
              <RollText>{n.label}</RollText>
              <sup>{n.num}</sup>
            </Link>
          ))}
        </nav>
        <div className="hdr__right">
          <button
            type="button"
            className="hdr__motion hdr-in"
            onClick={togglePaused}
            aria-pressed={paused}
            title={paused ? "Play motion" : "Pause motion"}
          >
            <span className={`motion-icon ${paused ? "is-paused" : ""}`} aria-hidden="true">
              <i /><i /><i />
            </span>
            <span className="mono">{paused ? "Motion off" : "Motion on"}</span>
          </button>
          <span className="hdr-in hdr__cta">
            <Magnetic strength={0.3}>
              <Link href="/contact" className="hdr__talk" data-cursor="hide">
                <RollText>Let’s talk</RollText>
                <Arrow />
              </Link>
            </Magnetic>
          </span>
          <button
            type="button"
            className={`burger hdr-in ${open ? "is-open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <i /><i />
          </button>
        </div>
      </header>

      <div id="site-menu" ref={menuRef} className="menu" style={{ display: "none" }}>
        <nav className="menu__nav" aria-label="Mobile">
          {[...nav, { label: "Let’s talk", href: "/contact", num: "04" }].map((n) => (
            <Link key={n.href + n.label} href={n.href} className="menu__link" onClick={() => setOpen(false)}>
              <span>
                <sup>{n.num}</sup>
                {n.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="menu__foot mono">
          <span>Dhaka ↗ Worldwide</span>
          <span>A concern of Dcastalia Limited</span>
        </div>
      </div>
    </>
  );
}
