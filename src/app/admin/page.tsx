import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projects, messages, gallery, highlights] = await Promise.all([
    prisma.project.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.galleryImage.count(),
    prisma.highlight.count(),
  ]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p style={{ color: "#9a9aa5" }}>Manage all public portfolio content from here.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem" }}>
        {[
          { label: "Case studies", value: projects, href: "/admin/projects" },
          { label: "Unread messages", value: messages, href: "/admin/messages" },
          { label: "Gallery images", value: gallery, href: "/admin/gallery" },
          { label: "Highlights", value: highlights, href: "/admin/highlights" },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="admin-card" style={{ display: "block" }}>
            <div style={{ color: "#9a9aa5", fontSize: "0.85rem" }}>{card.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.35rem" }}>{card.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
