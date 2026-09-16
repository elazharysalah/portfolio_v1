import type { PortfolioPayload } from "@/lib/types";

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6zm0 0l8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SocialIcon({ type }: { type: string }) {
  if (type === "linkedin") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M6.94 8.5H3.75V20h3.19V8.5zM5.34 4A1.84 1.84 0 103.5 5.84 1.84 1.84 0 005.34 4zM20.25 20h-3.18v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.45-2.15 2.96V20H9.88V8.5h3.05v1.57h.04c.42-.8 1.46-1.65 3.01-1.65 3.22 0 3.81 2.12 3.81 4.88V20z" />
      </svg>
    );
  }
  if (type === "github") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8a9.56 9.56 0 012.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0012 2z" />
      </svg>
    );
  }
  if (type === "resume") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M14 3v5h5M8.5 13h7M8.5 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 12h16M12 4c2.5 2.8 2.5 13.2 0 16M12 4c-2.5 2.8-2.5 13.2 0 16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Sidebar({ profile }: { profile: PortfolioPayload["profile"] }) {
  const socials = [
    { href: profile.linkedinUrl, label: "LinkedIn", type: "linkedin" },
    { href: profile.githubUrl, label: "GitHub", type: "github" },
    { href: profile.instagramUrl, label: "Instagram", type: "web" },
    { href: profile.facebookUrl, label: "Facebook", type: "web" },
    { href: profile.twitterUrl, label: "X", type: "web" },
    { href: profile.websiteUrl, label: "Website", type: "web" },
    { href: profile.resumeUrl, label: "Resume", type: "resume" },
  ].filter((s) => s.href);

  return (
    <aside className="card sidebar">
      <div className="sidebar-avatar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatarUrl || "/uploads/avatar-placeholder.svg"}
          alt={`${profile.name} profile`}
        />
      </div>
      <h1 className="sidebar-name">{profile.name}</h1>
      <span className="sidebar-title">{profile.title}</span>

      <ul className="sidebar-meta">
        <li>
          <span className="icon">
            <IconMail />
          </span>
          <div>
            <span className="label">Email</span>
            <a className="value" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
        </li>
        {profile.location && (
          <li>
            <span className="icon">
              <IconPin />
            </span>
            <div>
              <span className="label">Location</span>
              <span className="value">{profile.location}</span>
            </div>
          </li>
        )}
      </ul>

      <ul className="socials">
        {socials.map((s) => (
          <li key={s.label}>
            <a href={s.href!} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
              <SocialIcon type={s.type} />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
