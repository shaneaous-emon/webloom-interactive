"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contactPage } from "@/lib/content";
import { Arrow, RollText } from "@/components/ui/primitives";

const KEY = "webloom:brief-draft";
type Draft = { name: string; email: string; company: string; budget: string; idea: string };
const empty: Draft = { name: "", email: "", company: "", budget: "", idea: "" };

export function ContactForm() {
  const f = contactPage.form;
  const [d, setD] = useState<Draft>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [brief, setBrief] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setD({ ...empty, ...JSON.parse(saved) });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch {}
  }, [d]);

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!d.name.trim()) er.name = "Please add your name.";
    if (!/^\S+@\S+\.\S+$/.test(d.email)) er.email = "Please add a valid email.";
    if (d.idea.trim().length < 15) er.idea = "At least 15 characters, please.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBrief(
      [
        `Project brief — ${d.company || d.name}`,
        `Contact: ${d.name} <${d.email}>`,
        d.company && `Company: ${d.company}`,
        d.budget && `Budget: ${d.budget}`,
      ]
        .filter(Boolean)
        .join("\n") + `\n\n${d.idea.trim()}`
    );
  };

  return (
    <form className="cform" onSubmit={submit} noValidate>
      <h2 className="cform__title">{f.title}</h2>
      <p className="cform__note mono">{f.note}</p>

      <div className="cform__row">
        <Field label={f.name} required error={errors.name}>
          <input value={d.name} onChange={set("name")} autoComplete="name" />
        </Field>
        <Field label={f.email} required error={errors.email}>
          <input type="email" value={d.email} onChange={set("email")} autoComplete="email" />
        </Field>
      </div>
      <Field label={f.company} optional>
        <input value={d.company} onChange={set("company")} autoComplete="organization" />
      </Field>

      <fieldset className="cform__budget">
        <legend>{f.budget}</legend>
        <div className="chips">
          {f.budgets.map((b) => (
            <label key={b} className={`chip ${d.budget === b ? "is-on" : ""}`}>
              <input type="radio" name="budget" value={b} checked={d.budget === b} onChange={() => setD((p) => ({ ...p, budget: b }))} />
              {d.budget === b && <motion.span layoutId="chip-bg" className="chip__bg" />}
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={f.idea} required error={errors.idea} hint={f.ideaHint}>
        <textarea rows={5} value={d.idea} onChange={set("idea")} />
      </Field>

      <button type="submit" className="pill pill--accent cform__submit" data-cursor="hide">
        <span className="pill__fill" aria-hidden="true" />
        <RollText>{f.submit}</RollText>
        <span className="pill__icon">
          <Arrow />
        </span>
      </button>

      <AnimatePresence>
        {brief && (
          <motion.div
            className="cform__brief"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <p className="mono">Brief prepared · stays in this browser</p>
            <pre>{brief}</pre>
            <button type="button" className="mono cform__copy" onClick={() => navigator.clipboard?.writeText(brief)}>
              Copy brief ↗
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({
  label,
  required,
  optional,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span className="field__label">
        {label} {required && <em>(required)</em>}
        {optional && <em>(optional)</em>}
      </span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
