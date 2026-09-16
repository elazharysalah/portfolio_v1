import type { PortfolioPayload } from "@/lib/types";
import { CaseStudyGrid } from "@/components/site/CaseStudyGrid";

export function Portfolio({
  settings,
  projects,
}: {
  settings: PortfolioPayload["settings"];
  projects: PortfolioPayload["projects"];
}) {
  return (
    <section>
      <h2 className="section-title with-rule">{settings.portfolioTitle}</h2>
      <CaseStudyGrid projects={projects} emptyMessage="No projects yet." />
    </section>
  );
}
