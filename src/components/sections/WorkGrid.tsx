"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, workPage } from "@/lib/content";
import { ProjectCard } from "@/components/sections/Work";

const filters = ["All", "Websites", "Commerce", "Products"] as const;

export function WorkGrid() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const list = f === "All" ? projects : projects.filter((p) => p.category === f);
  return (
    <section className="section workgrid">
      <div className="wrap">
        <div className="filters" role="group" aria-label="Filter work">
          {filters.map((x) => {
            const n = x === "All" ? projects.length : projects.filter((p) => p.category === x).length;
            return (
              <button key={x} type="button" className={`chip ${f === x ? "is-on" : ""}`} onClick={() => setF(x)} aria-pressed={f === x}>
                {f === x && <motion.span layoutId="filter-bg" className="chip__bg" />}
                <span>{x}</span>
                <sup className="mono">{String(n).padStart(2, "0")}</sup>
              </button>
            );
          })}
          <p className="mono filters__note">{workPage.note}</p>
        </div>
        <motion.div layout className="workgrid__list">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard p={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
