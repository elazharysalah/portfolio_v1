"use client";

import { useState } from "react";
import type { PortfolioPayload, TabId } from "@/lib/types";
import { Sidebar } from "@/components/site/Sidebar";
import { Navbar } from "@/components/site/Navbar";
import { About } from "@/components/site/About";
import { Resume } from "@/components/site/Resume";
import { Portfolio } from "@/components/site/Portfolio";
import { Contact } from "@/components/site/Contact";
import { Gallery } from "@/components/site/Gallery";

export function PortfolioShell({ data }: { data: PortfolioPayload }) {
  const [tab, setTab] = useState<TabId>("about");

  return (
    <div className="page-shell">
      <Sidebar profile={data.profile} />
      <main className="card main-panel">
        <Navbar active={tab} onChange={setTab} />
        <div className="panel-body" key={tab}>
          {tab === "about" && (
            <About
              profile={data.profile}
              settings={data.settings}
              projects={data.projects.filter((p) => p.featured)}
            />
          )}
          {tab === "resume" && (
            <Resume
              settings={data.settings}
              experiences={data.experiences}
              education={data.education}
              skillGroups={data.skillGroups}
            />
          )}
          {tab === "portfolio" && (
            <Portfolio settings={data.settings} projects={data.projects} />
          )}
          {tab === "contact" && (
            <Contact profile={data.profile} settings={data.settings} />
          )}
          {tab === "gallery" && (
            <Gallery settings={data.settings} gallery={data.gallery} />
          )}
          {data.profile.footerText && tab === "about" && (
            <p className="footer-note">{data.profile.footerText}</p>
          )}
        </div>
      </main>
    </div>
  );
}
