"use client";

import { useState } from "react";
import type { PortfolioPayload } from "@/lib/types";
import { CaseStudyModal } from "@/components/site/CaseStudyModal";

type Project = PortfolioPayload["projects"][number];

function domainFromUrl(url?: string | null) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function CaseStudyGrid({
  projects,
  emptyMessage = "No case studies yet.",
}: {
  projects: Project[];
  emptyMessage?: string;
}) {
  const [active, setActive] = useState<Project | null>(null);

  if (projects.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <>
      <ul className="project-grid">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              className="project-card project-card-btn"
              onClick={() => setActive(project)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageUrl || "/uploads/project-placeholder.svg"}
                alt={project.title}
              />
              <span className="domain">
                {(project.accessMode || "link") === "link"
                  ? domainFromUrl(project.url)
                  : (project.accessMode || "link") === "request"
                    ? "Request access"
                    : "Case study"}
              </span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </button>
          </li>
        ))}
      </ul>

      {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
    </>
  );
}
