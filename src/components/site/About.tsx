import type { PortfolioPayload } from "@/lib/types";
import { CaseStudyGrid } from "@/components/site/CaseStudyGrid";

export function About({
  profile,
  settings,
  projects,
}: {
  profile: PortfolioPayload["profile"];
  settings: PortfolioPayload["settings"];
  projects: PortfolioPayload["projects"];
}) {
  return (
    <section>
      <h2 className="section-title with-rule">{settings.aboutTitle}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: profile.bio }} />

      <h3 className="block-title">{settings.featuredTitle}</h3>
      <p className="block-subtitle">{settings.featuredSubtitle}</p>
      <CaseStudyGrid projects={projects} emptyMessage="No case studies yet." />
    </section>
  );
}
