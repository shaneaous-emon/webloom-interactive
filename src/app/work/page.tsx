import type { Metadata } from "next";
import { workPage } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageHero label={workPage.label} title={workPage.title} body={workPage.body} />
      <WorkGrid />
      <CTA />
    </>
  );
}
