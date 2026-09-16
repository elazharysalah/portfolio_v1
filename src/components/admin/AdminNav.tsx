"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/highlights", label: "Highlights" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Case Studies" },
  { href: "/admin/access-requests", label: "Access Requests" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-nav">
      <h1>Portfolio Admin</h1>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? "active" : ""}
        >
          {link.label}
        </Link>
      ))}
      <div style={{ marginTop: "1.5rem", padding: "0 0.5rem" }}>
        <Link href="/" target="_blank">
          View site
        </Link>
        <button
          type="button"
          className="admin-btn"
          style={{ marginTop: "0.75rem", width: "100%" }}
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
