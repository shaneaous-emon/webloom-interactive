import { PageHero } from "@/components/sections/PageHero";
import { PillLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <PageHero label="404 / Lost thread" title={["This page wandered", "off the loom."]}>
      <div style={{ marginTop: "2.5rem" }}>
        <PillLink href="/">Back home</PillLink>
      </div>
    </PageHero>
  );
}
