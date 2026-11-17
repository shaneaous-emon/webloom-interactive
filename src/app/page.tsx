import { Hero } from "@/components/sections/Hero";
import { Statement, StackMarquee } from "@/components/sections/Statement";
import { Services } from "@/components/sections/Services";
import { Playground } from "@/components/sections/Playground";
import { WorkShowcase } from "@/components/sections/Work";
import { Results } from "@/components/sections/Results";
import { Process, Principles } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <StackMarquee />
      <Services />
      <Playground />
      <WorkShowcase />
      <Results />
      <Process />
      <Principles />
      <CTA />
    </>
  );
}
