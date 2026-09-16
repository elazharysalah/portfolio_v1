import { PortfolioShell } from "@/components/site/PortfolioShell";
import { getPortfolioData } from "@/lib/data";
import type { PortfolioPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPortfolioData();

  if (!data.profile || !data.settings) {
    return (
      <div className="page-shell">
        <div className="card panel-body">
          <h1>Portfolio not seeded</h1>
          <p className="empty-state">
            Run <code>npm run db:setup</code> after starting Postgres.
          </p>
        </div>
      </div>
    );
  }

  const payload: PortfolioPayload = {
    profile: data.profile,
    settings: data.settings,
    highlights: data.highlights,
    experiences: data.experiences,
    education: data.education,
    skillGroups: data.skillGroups,
    projects: data.projects.map((project) => ({
      ...project,
      accessMode:
        project.accessMode === "hidden" || project.accessMode === "request"
          ? project.accessMode
          : "link",
    })),
    gallery: data.gallery,
  };

  return <PortfolioShell data={payload} />;
}
