import type { Metadata } from "next";
import { about } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { Principles } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";
import { AboutBody } from "@/components/sections/AboutBody";

export const metadata: Metadata = { title: "Studio" };

export default function AboutPage() {
  return (
    <>
      <PageHero label={about.label} title={about.title} body={about.body} />
      <AboutBody />
      <Principles />
      <CTA />
    </>
  );
}
