import type { Metadata } from "next";
import { servicesPage } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { Services } from "@/components/sections/Services";
import { Playground } from "@/components/sections/Playground";
import { Process } from "@/components/sections/Process";
import { StackMarquee } from "@/components/sections/Statement";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = { title: "Expertise" };

export default function ServicesPage() {
  return (
    <>
      <PageHero label={servicesPage.label} title={servicesPage.title} body={servicesPage.body} />
      <StackMarquee />
      <Services />
      <Playground />
      <Process />
      <CTA />
    </>
  );
}
