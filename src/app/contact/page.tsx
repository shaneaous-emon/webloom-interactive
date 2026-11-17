import type { Metadata } from "next";
import { contactPage } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const s = contactPage.side;
  return (
    <>
      <PageHero label={contactPage.label} title={contactPage.title} body={contactPage.body} />
      <section className="section contact">
        <div className="wrap contact__grid">
          <aside className="contact__side">
            <p className="label mono">{s.label}</p>
            <h2 className="h3">
              {s.title[0]}
              <br />
              <em>{s.title[1]}</em>
            </h2>
            <p>{s.body}</p>
            <p className="mono contact__loc">
              <span className="live-dot" aria-hidden="true" />
              {s.location}
            </p>
            <p className="mono contact__note">{s.note}</p>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
